import subprocess
import os
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Le dossier où se trouvent les fichiers .tf
INFRA_DIR = Path(os.path.dirname(__file__)).parent.parent / "infrastructure"

def run_terraform_provision(vm_name: str) -> dict:
    """
    Exécute Terraform pour créer la VM et retourne l'IP et la clé SSH.
    """
    logger.info(f"Début du provisionnement Terraform pour {vm_name} dans {INFRA_DIR}")
    password = "Projet-ABK-3"  # Idéalement à mettre dans .env
    
    # Environment variables for terraform
    env = os.environ.copy()
    env["TF_VAR_os_password"] = password
    env["TF_VAR_vm_name"] = vm_name

    try:
        # 1. Initialize
        logger.info("Exécution de terraform init...")
        subprocess.run(["terraform", "init"], cwd=str(INFRA_DIR), env=env, check=True, capture_output=True)

        # 2. Apply
        logger.info("Exécution de terraform apply...")
        subprocess.run(["terraform", "apply", "-auto-approve"], cwd=str(INFRA_DIR), env=env, check=True, capture_output=True)

        # 3. Get outputs
        logger.info("Récupération des outputs Terraform...")
        result = subprocess.run(["terraform", "output", "-json"], cwd=str(INFRA_DIR), env=env, check=True, capture_output=True, text=True)
        
        outputs = json.loads(result.stdout)
        ip_address = outputs.get("vm_ip", {}).get("value")
        private_key = outputs.get("private_key", {}).get("value")

        logger.info(f"Provisionnement réussi ! IP: {ip_address}")
        return {
            "ip": ip_address,
            "private_key": private_key
        }
    except subprocess.CalledProcessError as e:
        logger.error(f"Erreur Terraform: {e.stderr if hasattr(e, 'stderr') else str(e)}")
        raise Exception(f"Échec du provisionnement Terraform: {e.stderr if hasattr(e, 'stderr') else str(e)}")
    except Exception as e:
        logger.error(f"Erreur inattendue: {str(e)}")
        raise e
