# Guide étudiant

## 1. Se connecter
Allez sur le portail et cliquez **Se connecter avec Office 365** (compte @git.ch).

## 2. Demander une VM
1. Cliquez **Nouvelle demande**
2. Choisissez le template de votre cours
3. Indiquez date de début et date de fin (obligatoire)
4. Envoyez

## 3. Recevoir la réponse
Vous recevez un e-mail :
- ✅ Approuvée → votre VM est prête en 5-10 min
- ❌ Refusée → motif dans l'e-mail

## 4. Se connecter à la VM
```bash
ssh ubuntu@<ip-fournie> -i votre_cle.pem
```
Aucun mot de passe root. Accès SSH uniquement.

## 5. Fin de la VM
La VM est détruite automatiquement à la date de fin. Sauvegardez votre travail avant.
