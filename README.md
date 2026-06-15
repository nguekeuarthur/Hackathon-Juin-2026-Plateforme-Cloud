# GIT VM Platform

Plateforme de provisioning de machines virtuelles en libre-service pour le Geneva Institute of Technology.

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js (React) |
| Backend | FastAPI (Python) |
| Infrastructure | OpenTofu + Infomaniak Public Cloud (OpenStack) |
| Configuration | Ansible |
| Base de données | PostgreSQL |
| Monitoring | Prometheus + Grafana |
| Auth | OIDC / Microsoft Entra ID |

## Prérequis

- Python 3.11+
- Node.js 20+
- OpenTofu 1.7+
- Ansible 2.15+
- Un compte Infomaniak Public Cloud avec accès API OpenStack
- Un tenant Microsoft Entra ID (dev ou production)

## Déploiement depuis zéro

### 1. Cloner le dépôt

```bash
git clone https://github.com/<org>/git-vm-platform.git
cd git-vm-platform
```

### 2. Infrastructure (OpenTofu)

```bash
cd infra/opentofu/environments/dev
cp terraform.tfvars.example terraform.tfvars
# Remplir les variables Infomaniak
tofu init
tofu plan
tofu apply
```

### 3. API (FastAPI)

```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Remplir les variables d'environnement
uvicorn app.main:app --reload
```

### 4. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Remplir NEXTAUTH_URL, AZURE_CLIENT_ID, etc.
npm run dev
```

### 5. Ansible (configuration des VMs)

```bash
cd infra/ansible
ansible-galaxy install -r requirements.yml
# Les playbooks sont appelés automatiquement par l'API après provisioning
```

## Structure du dépôt

```
.
├── infra/
│   ├── opentofu/        # Infrastructure as Code
│   └── ansible/         # Configuration des VMs
├── api/                 # Backend FastAPI
├── frontend/            # Portail Next.js
└── docs/
    ├── adr/             # Décisions d'architecture
    ├── guides/          # Guides utilisateurs
    └── runbook/         # Exploitation
```

## Équipe

| Rôle | Responsabilité |
|------|----------------|
| Lead Infra | OpenTofu, Ansible, réseau OpenStack |
| Lead Dev | FastAPI, BDD, auth OIDC, scheduler |
| Frontend | Next.js, portail étudiant/validateur |
| QA / Doc | Tests, guides, backlog |
