from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class RequestCreate(BaseModel):
    template: str
    starts_at: datetime
    ends_at: datetime
    group_size: int = 1  # formateur peut demander N machines

class RequestValidate(BaseModel):
    approved: bool
    comment: str = ""

@router.post("/")
def create_request(body: RequestCreate):
    # TODO: extraire user depuis JWT
    # TODO: valider que ends_at > starts_at
    # TODO: persister en BDD
    # TODO: envoyer notification e-mail aux validateurs
    return {"id": "uuid-placeholder", "status": "pending"}

@router.get("/")
def list_requests():
    # TODO: filtrer selon rôle (validateur = tout, étudiant = les siens)
    return []

@router.patch("/{request_id}/validate")
def validate_request(request_id: str, body: RequestValidate):
    # TODO: vérifier rôle validateur dans le JWT
    # TODO: si approved → subprocess OpenTofu + Ansible
    # TODO: notifier demandeur par e-mail
    return {"id": request_id, "approved": body.approved}
