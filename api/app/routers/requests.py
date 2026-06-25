from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.security import get_current_user
from app.models.request import VMRequest, RequestStatus
from app.schemas.request import RequestCreate, RequestValidate, RequestResponse
from app.services.email import send_approval_email, send_rejection_email
from app.services.provisioning import run_terraform_provision
from typing import List
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def process_approved_request(request_id: int, flavor_name: str, template_id: str):
    """Tâche d'arrière-plan pour provisionner la VM via Terraform et envoyer l'e-mail."""
    db = SessionLocal()
    try:
        db_request = db.query(VMRequest).filter(VMRequest.id == request_id).first()
        if not db_request:
            logger.error(f"Demande {request_id} introuvable pour le provisionnement.")
            return

        # 1. Provisionner la VM via Terraform
        short_id = str(db_request.id)[:8]
        template_val = getattr(db_request.template, "value", str(db_request.template))
        vm_name = f"vm-{short_id}-{template_val.replace(' ', '-').lower()}"
        logger.info(f"Démarrage du provisionnement pour {vm_name}")
        
        tf_result = run_terraform_provision(vm_name=vm_name, flavor_name=flavor_name, template_id=template_id)
        ip_address = tf_result["ip"]
        private_key = tf_result.get("private_key")
        
        # 2. Mettre à jour la base de données
        db_request.vm_ip = ip_address
        db.commit()
        db.refresh(db_request)
        
        # 3. Envoyer l'e-mail avec la bonne IP et la clé SSH
        send_approval_email(
            to=db_request.requester,
            vm_ip=ip_address,
            vm_id=db_request.vm_id,
            ends_at=db_request.ends_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
            private_key=private_key
        )
        logger.info(f"Processus d'approbation terminé avec succès pour la demande {request_id}.")
    except Exception as e:
        logger.error(f"Échec du processus de provisionnement pour la demande {request_id}: {str(e)}")
    finally:
        db.close()

@router.post("/", response_model=RequestResponse)
def create_request(
    body: RequestCreate, 
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)
):
    if body.ends_at <= body.starts_at:
        raise HTTPException(status_code=400, detail="ends_at doit être supérieur à starts_at")
        
    db_request = VMRequest(
        requester=user["email"],
        template=body.template,
        group_size=body.group_size,
        starts_at=body.starts_at,
        ends_at=body.ends_at,
        status=RequestStatus.PENDING
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request

@router.get("/", response_model=List[RequestResponse])
def list_requests(
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)
):
    if user["role"] in ["validator", "admin"]:
        return db.query(VMRequest).all()
    else:
        return db.query(VMRequest).filter(VMRequest.requester == user["email"]).all()

@router.patch("/{request_id}/validate", response_model=RequestResponse)
def validate_request(
    request_id: str, 
    body: RequestValidate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)
):
    if user["role"] not in ["validator", "admin"]:
        raise HTTPException(status_code=403, detail="Rôle validateur requis pour cette action")
        
    db_request = db.query(VMRequest).filter(VMRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Demande introuvable")
        
    if db_request.status != RequestStatus.PENDING:
        raise HTTPException(status_code=400, detail="Seule une demande en attente peut être validée")
        
    db_request.status = RequestStatus.APPROVED if body.approved else RequestStatus.REJECTED
    db_request.validated_by = user["email"]
    db_request.validated_at = datetime.now(timezone.utc)
    
    # Envoi de la notification e-mail
    if body.approved:
        # Lancer le provisionnement Terraform + Email en background
        background_tasks.add_task(
            process_approved_request,
            request_id=db_request.id,
            flavor_name=body.flavor_name,
            template_id=body.template_id
        )
    else:
        background_tasks.add_task(
            send_rejection_email,
            to=db_request.requester,
            comment=body.comment
        )
    
    db.commit()
    db.refresh(db_request)
    
    return db_request
