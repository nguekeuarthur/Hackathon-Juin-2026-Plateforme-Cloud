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

# Un réseau isolé par template de cours
resource "openstack_networking_network_v2" "course_networks" {
  for_each       = toset(["linux-admin", "dev-web", "data-science", "cybersec"])
  name           = "net-${each.key}"
  admin_state_up = true
}

resource "openstack_networking_subnet_v2" "course_subnets" {
  for_each   = openstack_networking_network_v2.course_networks
  name       = "subnet-${each.key}"
  network_id = each.value.id
  cidr = lookup({
    "linux-admin"  = "10.10.1.0/24"
    "dev-web"      = "10.10.2.0/24"
    "data-science" = "10.10.3.0/24"
    "cybersec"     = "10.10.4.0/24"
  }, each.key)
  ip_version = 4
}

# VM de test sur le réseau linux-admin
module "vm_test" {
  source        = "../../modules/vm"
  name          = "git-vm-test"
  key_pair_name = var.key_pair_name
  network_name  = openstack_networking_network_v2.course_networks["linux-admin"].name
  course        = "linux-admin"
  owner_email   = "test@git.ch"
  ends_at       = "2026-06-26T18:00:00Z"
  request_id    = "test-001"

  depends_on = [openstack_networking_subnet_v2.course_subnets]
}