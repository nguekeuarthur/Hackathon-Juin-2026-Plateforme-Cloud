# ADR-002 — Framework backend

**Date** : 15 juin 2026 | **Statut** : Accepté

## Décision
**FastAPI (Python)**

## Alternatives considérées

| Option | Raison du rejet |
|--------|-----------------|
| Express.js | Équipe plus à l'aise Python |
| Django | Trop lourd pour API pure |
| **FastAPI** | Rapide, Pydantic, doc Swagger auto |

## Conséquences
- Documentation `/docs` générée automatiquement
- Même langage que les scripts OpenTofu/Ansible → cohérence équipe
