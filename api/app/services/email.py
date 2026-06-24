import smtplib
from email.message import EmailMessage
import os
import logging

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.office365.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_notification(to: str, subject: str, body: str):
    if not SMTP_USER or not SMTP_PASSWORD or SMTP_PASSWORD == "your-smtp-password":
        logger.warning(f"Configuration SMTP invalide ou mockée, e-mail ignoré. [To: {to}, Subject: {subject}]")
        logger.info(f"Contenu de l'e-mail simulé:\n{body}")
        return

    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info(f"E-mail envoyé avec succès à {to}")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'e-mail à {to} : {e}")

def send_approval_email(to: str, vm_ip: str, vm_id: str, ends_at: str, private_key: str = None):
    subject = "[GIT VM Platform] Votre machine virtuelle a été approuvée"
    ip = vm_ip if vm_ip else "<attribuée après instanciation>"
    
    body = (
        f"Bonjour,\n\n"
        f"Votre demande de machine virtuelle a été approuvée et la machine est prête !\n\n"
        f"Détails de connexion :\n"
        f"1. Téléchargez la clé SSH en pièce jointe (key.pem).\n"
        f"2. Modifiez les permissions de la clé : chmod 400 key.pem\n"
        f"3. Connectez-vous avec : ssh -i key.pem ubuntu@{ip}\n\n"
        f"Date de fin de validité : {ends_at}\n\n"
        f"Cordialement,\n"
        f"L'équipe GIT"
    )
    
    if not SMTP_USER or not SMTP_PASSWORD or SMTP_PASSWORD == "your-smtp-password":
        logger.warning(f"Configuration SMTP invalide ou mockée, e-mail ignoré. [To: {to}, Subject: {subject}]")
        logger.info(f"Contenu de l'e-mail simulé:\n{body}\n[Pièce jointe : key.pem avec la clé SSH secrète]")
        return

    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to
    
    if private_key:
        msg.add_attachment(
            private_key.encode('utf-8'), 
            maintype='application', 
            subtype='x-pem-file', 
            filename='key.pem'
        )

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info(f"E-mail envoyé avec succès à {to}")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'e-mail à {to} : {e}")

def send_rejection_email(to: str, comment: str):
    subject = "[GIT VM Platform] Votre demande de machine virtuelle a été refusée"
    body = (
        f"Bonjour,\n\n"
        f"Votre demande de machine virtuelle a été refusée pour le motif suivant :\n"
        f"{comment}\n\n"
        f"Cordialement,\n"
        f"L'équipe GIT"
    )
    send_notification(to, subject, body)
