from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import get_current_user
from app.models.request import VMRequest, RequestStatus
from app.schemas.request import RequestCreate, RequestValidate, RequestResponse
from app.services.email import send_approval_email, send_rejection_email
from typing import List
from datetime import datetime, timezone

router = APIRouter()

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
        # TODO: Lancer OpenTofu / Ansible en background
        background_tasks.add_task(
            send_approval_email,
            to=db_request.requester,
            vm_ip=db_request.vm_ip,
            vm_id=db_request.vm_id,
            ends_at=db_request.ends_at.strftime("%Y-%m-%d %H:%M:%S UTC")
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
