variable "os_auth_url" {
  type = string
}

variable "os_tenant_name" {
  type = string
}

variable "os_username" {
  type = string
}

variable "os_password" {
  type      = string
  sensitive = true
}

variable "os_region" {
  type    = string
  default = "dc3-a"
}

variable "key_pair_name" {
  type = string
}

variable "network_name" {
  type = string
}
