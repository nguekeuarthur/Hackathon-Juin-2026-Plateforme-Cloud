from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
import os
import httpx
from jose import jwt as jose_jwt
from app.security import create_access_token
from datetime import timedelta

router = APIRouter()

AZURE_TENANT_ID = os.getenv("AZURE_TENANT_ID")
AZURE_CLIENT_ID = os.getenv("AZURE_CLIENT_ID")
AZURE_CLIENT_SECRET = os.getenv("AZURE_CLIENT_SECRET")
MOCK_AUTH = os.getenv("MOCK_AUTH", "False").lower() in ("true", "1", "yes")

REDIRECT_URI = "http://localhost:8000/auth/callback"

@router.get("/login")
def login():
    """Redirige vers Microsoft Entra ID pour l'authentification OIDC."""
    if MOCK_AUTH:
        # En mode mock, on redirige directement vers notre callback avec un faux code
        return RedirectResponse(url=f"{REDIRECT_URI}?code=mock_code_123")

    if not AZURE_TENANT_ID or not AZURE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Azure AD configuration missing")
        
    auth_url = (
        f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/authorize"
        f"?client_id={AZURE_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=openid+profile+email"
    )
    return RedirectResponse(auth_url)

@router.get("/callback")
async def callback(code: str):
    """Reçoit le code OAuth2, échange contre un token, retourne un JWT interne."""
    if MOCK_AUTH and code.startswith("mock_code"):
        # Valeurs simulées avec gestion des rôles
        if code == "mock_code_validator":
            email = "validator@git.ch"
            name = "Mock Validator"
            role = "validator"
        elif code == "mock_code_formateur":
            email = "formateur@git.ch"
            name = "Mock Formateur"
            role = "formateur"
        else:
            email = "student@git.ch"
            name = "Mock Student"
            role = "student"
    else:
        token_url = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/token"
        
        data = {
            "client_id": AZURE_CLIENT_ID,
            "client_secret": AZURE_CLIENT_SECRET,
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Échec de l'authentification auprès de Microsoft Entra ID")
            
        token_data = response.json()
        id_token = token_data.get("id_token")
        
        if not id_token:
            raise HTTPException(status_code=400, detail="Aucun id_token retourné")
            
        # On décode l'id_token pour extraire les infos utilisateur
        payload = jose_jwt.get_unverified_claims(id_token)
        email = payload.get("email") or payload.get("preferred_username")
        name = payload.get("name")
        
        # Extraction du rôle depuis le token Microsoft Entra ID (claim 'roles')
        roles_claim = payload.get("roles", [])
        if "validator" in roles_claim or "Admin" in roles_claim:
            role = "validator"
        elif "formateur" in roles_claim or "Teacher" in roles_claim:
            role = "formateur"
        else:
            role = "student"
    
    # Génération du token interne
    from app.security import ACCESS_TOKEN_EXPIRE_MINUTES
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    internal_token = create_access_token(
        data={"sub": email, "name": name, "role": role},
        expires_delta=access_token_expires
    )
    
    return {"access_token": internal_token, "token_type": "bearer"}
