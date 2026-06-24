variable "os_password" {
  description = "Mot de passe OpenStack"
  sensitive   = true
}

variable "vm_name" {
  description = "Nom de la machine virtuelle"
  default     = "lab-vm-01"
}

variable "template_id" {
  description = "UUID de l'image Infomaniak"
  default     = "1cb0a6a2-2dc2-46cd-bb23-1070d7f0e9d6" # Ubuntu 22.04 LTS
}
