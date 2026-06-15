from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import os

router = APIRouter()

AZURE_TENANT_ID  = os.getenv("AZURE_TENANT_ID")
AZURE_CLIENT_ID  = os.getenv("AZURE_CLIENT_ID")

@router.get("/login")
def login():
    """Redirige vers Microsoft Entra ID pour l'authentification OIDC."""
    auth_url = (
        f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/authorize"
        f"?client_id={AZURE_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri=http://localhost:8000/auth/callback"
        f"&scope=openid+profile+email"
    )
    return RedirectResponse(auth_url)

@router.get("/callback")
def callback(code: str):
    """Reçoit le code OAuth2, échange contre un token, retourne un JWT interne."""
    # TODO: échanger code contre access_token Microsoft
    # TODO: valider le token et extraire email + rôle
    # TODO: générer un JWT interne signé
    return {"token": "jwt-placeholder", "role": "student"}
