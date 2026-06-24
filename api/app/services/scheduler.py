from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.models.request import VMRequest, RequestStatus
from datetime import datetime, timezone
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def destroy_expired_vms():
    logger.info("Exécution du job APScheduler: Recherche des VMs expirées...")
    try:
        with SessionLocal() as db:
            now = datetime.now(timezone.utc)
            
            expired_requests = db.query(VMRequest).filter(
                VMRequest.ends_at <= now,
                VMRequest.status.in_([RequestStatus.RUNNING, RequestStatus.APPROVED])
            ).all()

            if expired_requests:
                logger.info(f"{len(expired_requests)} VM(s) expirée(s) trouvée(s).")
                
            for req in expired_requests:
                logger.info(f"Destruction de la VM pour la requête {req.id} (expirée le {req.ends_at})")
                
                # TODO: Appeler subprocess openTofu destroy
                
                req.status = RequestStatus.DESTROYED
                db.commit()
    except Exception as e:
        logger.error(f"Erreur lors de l'exécution du job : {e}")

# Exécuté toutes les minutes pour faciliter le test,
scheduler.add_job(destroy_expired_vms, 'interval', minutes=1, id='destroy_vms_job', replace_existing=True)

def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler démarré.")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler arrêté.")
