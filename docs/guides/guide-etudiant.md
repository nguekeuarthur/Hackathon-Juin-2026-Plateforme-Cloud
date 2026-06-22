# Guide étudiant

## 1. Se connecter

Allez sur le portail et cliquez **Se connecter avec Office 365** (compte @git.ch).

## 2. Demander une VM

1. Cliquez **Nouvelle demande**
2. Choisissez le modèle de votre cours
3. Indiquez date de début et date de fin (obligatoire)
4. Envoyez

## 3. Vérifier l'état de votre demande

1. Sur votre tableau de bord, vous voyez la liste de vos demandes.
2. Chaque demande affiche un statut :
   - **En attente** : votre demande est en cours de validation
   - **Approuvée** : votre demande est acceptée, vous pouvez accéder à votre VM
   - **Refusée** : votre demande a été refusée (une raison est indiquée)

## 4. Accéder à votre machine virtuelle (SSH)

Une fois votre demande **approuvée** :

1. Sur votre tableau de bord, repérez la demande approuvée.
2. Cliquez sur **"Voir les détails"**.
3. Vous verrez les informations de connexion :
   - **Adresse IP** : l'adresse de votre VM
   - **Port SSH** : le port à utiliser
   - **Identifiant** : votre nom d'utilisateur SSH
4. Ouvrez un terminal (invité de commandes) sur votre ordinateur.
5. Tapez la commande suivante :
   ssh identifiant@adresse_IP -p port
   (remplacez identifiant, adresse_IP et port par les valeurs fournies)
6. Entrez votre mot de passe lorsque le terminal vous le demande.

## 5. Utiliser votre machine virtuelle

Une fois connecté en SSH, vous pouvez :
- Installer les logiciels dont vous avez besoin
- Télécharger vos fichiers
- Exécuter vos programmes
- Faire vos travaux pratiques

## 6. Terminer votre session et arrêter la VM

Quand vous avez fini de travailler :

1. Dans le terminal SSH, tapez :
   exit
   pour vous déconnecter.

2. Retournez sur la plateforme, sur votre tableau de bord.
3. Cliquez sur la demande correspondant à votre VM.
4. Cliquez sur le bouton **"Arrêter la VM"** ou **"Libérer la ressource"**.

Attention : si vous ne l'arrêtez pas, elle continuera de consommer des ressources et du budget !

## 7. Prolonger votre demande (si nécessaire)

Si vous avez besoin de plus de temps :

1. Allez sur votre tableau de bord.
2. Repérez votre demande active.
3. Cliquez sur **"Prolonger"** ou **"Demander une prolongation"**.
4. Choisissez la durée supplémentaire.
5. Validez.

Une nouvelle demande de validation sera envoyée.

## 8. Aide et support

Si vous rencontrez des problèmes :
- Contactez votre formateur
- Envoyez un message via l'onglet "Support" de la plateforme

