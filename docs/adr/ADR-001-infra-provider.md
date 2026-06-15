# ADR-001 — Choix du provider d'infrastructure

**Date** : 15 juin 2026 | **Statut** : Accepté

## Contexte
Nous devons provisionner des VMs à la demande pour les étudiants du GIT.

## Décision
**Infomaniak Public Cloud (OpenStack)** via **OpenTofu**.

## Alternatives considérées

| Option | Raison du rejet |
|--------|-----------------|
| AWS EC2 | Hors budget, pas de compte fourni |
| Azure VMs | Pas de compte fourni |
| **Infomaniak OpenStack** | Compte fourni, hébergement CH (RGPD), open source |

## Conséquences
- Provider OpenStack stable pour OpenTofu
- Coûts facturés à l'heure → destruction automatique = économies directes
- Données hébergées en Suisse → conformité RGPD native
