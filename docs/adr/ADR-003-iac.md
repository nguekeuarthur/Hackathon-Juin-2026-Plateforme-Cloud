# ADR-003 — Infrastructure as Code

**Date** : 15 juin 2026 | **Statut** : Accepté

## Décision
**OpenTofu** (fork open source de Terraform) + **Ansible** pour la configuration.

## Alternatives considérées

| Option | Raison du rejet |
|--------|-----------------|
| Terraform | Licence BSL restrictive depuis v1.6 |
| Pulumi | Moins standard, courbe apprentissage |
| Scripts bash | Non reproductible, difficile à maintenir |
| **OpenTofu + Ansible** | Open source, standard marché, bien documenté |

## Conséquences
- OpenTofu = création/destruction des VMs (cycle de vie)
- Ansible = installation des outils de cours (configuration)
- Séparation claire des responsabilités
