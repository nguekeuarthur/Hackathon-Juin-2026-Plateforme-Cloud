terraform {
  required_providers {
    openstack = {
      source  = "terraform-provider-openstack/openstack"
      version = "~> 1.54"
    }
  }
}

provider "openstack" {
  auth_url    = var.os_auth_url
  tenant_name = var.os_tenant_name
  user_name   = var.os_username
  password    = var.os_password
  region      = var.os_region
}

module "vm_test" {
  source        = "../../modules/vm"
  name          = "git-vm-test"
  key_pair_name = var.key_pair_name
  network_name  = var.network_name
  course        = "linux-admin"
  owner_email   = "test@git.ch"
  ends_at       = "2026-06-26T18:00:00Z"
  request_id    = "test-001"
}
