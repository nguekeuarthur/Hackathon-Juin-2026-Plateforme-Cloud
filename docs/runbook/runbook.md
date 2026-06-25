# Runbook d'exploitation

## Une VM ne se provisionne pas

**Objectif** : Diagnostiquer et résoudre un échec de provisionnement.

**Prérequis** : Accès SSH au serveur, dashboard Infomaniak, ID requête.

### Étapes

1. **Consulter les logs**
```bash
journalctl -u gitvm-api -f
cd infra/opentofu/environments/dev && tofu show
