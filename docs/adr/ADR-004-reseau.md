# ADR-004 — Isolation réseau entre classes

**Date** : 15 juin 2026 | **Statut** : Accepté

## Contexte
Les étudiants de cours différents partagent la même infrastructure OpenStack.
Sans isolation, une VM du cours Linux Admin pourrait communiquer avec une VM
du cours Data Science — ce qui pose des problèmes de sécurité et de confidentialité.

## Décision
**Un réseau OpenStack dédié par template de cours**, provisionné via OpenTofu.

| Template | Réseau | Subnet |
|----------|--------|--------|
| linux-admin | net-linux-admin | 10.10.1.0/24 |
| dev-web | net-dev-web | 10.10.2.0/24 |
| data-science | net-data-science | 10.10.3.0/24 |
| cybersec | net-cybersec | 10.10.4.0/24 |

## Alternatives considérées

| Option | Raison du rejet |
|--------|-----------------|
| VLANs manuels | Non reproductible, pas IaC |
| Security groups uniquement | Isolation logique mais pas réseau |
| **Réseaux OpenStack séparés** | Isolation réseau complète, géré par OpenTofu |

## Validation
Test ping entre VM linux-admin (10.10.1.x) et VM dev-web (10.10.2.x) :
les deux VMs ne peuvent pas se joindre — isolation confirmée.

## Conséquences
- Chaque cours est dans son propre réseau L2
- Pas de trafic croisé entre classes possible
- Les réseaux sont créés une seule fois au déploiement initial