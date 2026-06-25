import smtplib
from email.message import EmailMessage
import os
import logging

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.office365.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)  # Adresse d'expéditeur vérifiée dans Brevo

def send_notification(to: str, subject: str, body: str):
    if not SMTP_USER or not SMTP_PASSWORD or SMTP_PASSWORD == "your-smtp-password":
        logger.warning(f"Configuration SMTP invalide ou mockée, e-mail ignoré. [To: {to}, Subject: {subject}]")
        logger.info(f"Contenu de l'e-mail simulé:\n{body}")
        return

    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
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
    subject = "[GIT VM Platform] Votre machine virtuelle est prête !"
    ip = vm_ip if vm_ip else "<attribuée après instanciation>"
    
    key_section = ""
    if private_key:
        key_section = (
            f"\n"
            f"========== CLÉ SSH PRIVÉE (à sauvegarder dans un fichier key.pem) ==========\n"
            f"{private_key}"
            f"============================================================================\n"
            f"\n"
        )
    
    body = (
        f"Bonjour,\n\n"
        f"Votre demande de machine virtuelle a été approuvée et la machine est prête !\n\n"
        f"=== DÉTAILS DE CONNEXION ===\n"
        f"Adresse IP : {ip}\n"
        f"Utilisateur : ubuntu\n"
        f"Date de fin : {ends_at}\n\n"
        f"=== INSTRUCTIONS ===\n"
        f"1. Copiez la clé SSH ci-dessous dans un fichier nommé 'key.pem'\n"
        f"2. Ouvrez un terminal et tapez : chmod 400 key.pem\n"
        f"3. Connectez-vous avec : ssh -i key.pem ubuntu@{ip}\n"
        f"{key_section}"
        f"Cordialement,\n"
        f"L'équipe GIT - Geneva Institute of Technology\n"
    )
    
    if not SMTP_USER or not SMTP_PASSWORD or SMTP_PASSWORD == "your-smtp-password":
        logger.warning(f"Configuration SMTP invalide ou mockée, e-mail ignoré. [To: {to}, Subject: {subject}]")
        logger.info(f"Contenu de l'e-mail simulé:\n{body}")
        return

    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to

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

