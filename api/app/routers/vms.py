from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_vms():
    # TODO: interroger OpenStack API pour état réel des VMs
    return []

@router.get("/{vm_id}/status")
def vm_status(vm_id: str):
    # TODO: up/down, CPU, RAM via OpenStack + Prometheus
    return {"vm_id": vm_id, "status": "unknown"}
