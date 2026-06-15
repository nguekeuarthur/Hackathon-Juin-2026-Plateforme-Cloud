# Runbook d'exploitation

## Une VM ne se provisionne pas
1. `journalctl -u gitvm-api -f` → chercher l'erreur OpenTofu
2. `cd infra/opentofu/environments/dev && tofu show` → état de l'infra
3. Vérifier quota Infomaniak (dashboard Public Cloud)
4. Relancer : `POST /admin/requests/{id}/retry`

## Ajouter un template au catalogue
1. Créer `infra/ansible/roles/<nom>/tasks/main.yml`
2. Ajouter valeur dans `CourseTemplate` (enum `api/app/models/request.py`)
3. Ajouter option dans le formulaire frontend
4. Tester en dev, puis merger sur main

## Demande bloquée en "pending"
1. Vérifier que le validateur a reçu l'e-mail de notification
2. Valider manuellement via `PATCH /requests/{id}/validate`
3. Si récurrent : vérifier config SMTP dans `.env`

## Destruction manuelle d'une VM
```bash
cd infra/opentofu/environments/dev
tofu destroy -target=module.vm_<request_id>
```
