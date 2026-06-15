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

# Réseaux isolés par cours
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

# VM 1 — linux-admin
module "vm_linux" {
  source        = "../../modules/vm"
  name          = "git-vm-linux-admin"
  key_pair_name = var.key_pair_name
  network_name  = openstack_networking_network_v2.course_networks["linux-admin"].name
  course        = "linux-admin"
  owner_email   = "test@git.ch"
  ends_at       = "2026-06-26T18:00:00Z"
  request_id    = "test-001"
  depends_on    = [openstack_networking_subnet_v2.course_subnets]
}

# VM 2 — dev-web
module "vm_devweb" {
  source        = "../../modules/vm"
  name          = "git-vm-dev-web"
  key_pair_name = var.key_pair_name
  network_name  = openstack_networking_network_v2.course_networks["dev-web"].name
  course        = "dev-web"
  owner_email   = "test@git.ch"
  ends_at       = "2026-06-26T18:00:00Z"
  request_id    = "test-002"
  depends_on    = [openstack_networking_subnet_v2.course_subnets]
}
# Routeur connecté au réseau externe
resource "openstack_networking_router_v2" "main_router" {
  name                = "git-router"
  admin_state_up      = true
  external_network_id = "0f9c3806-bd21-490f-918d-4a6d1c648489"
}

# Connexion réseau linux-admin au routeur
resource "openstack_networking_router_interface_v2" "linux_admin_iface" {
  router_id = openstack_networking_router_v2.main_router.id
  subnet_id = openstack_networking_subnet_v2.course_subnets["linux-admin"].id
}

# IP flottante pour la VM linux-admin
resource "openstack_networking_floatingip_v2" "vm_linux_fip" {
  pool       = "ext-floating1"
  depends_on = [openstack_networking_router_interface_v2.linux_admin_iface]
}

resource "openstack_compute_floatingip_associate_v2" "vm_linux_fip_assoc" {
  floating_ip = openstack_networking_floatingip_v2.vm_linux_fip.address
  instance_id = module.vm_linux.vm_id
}
output "vm_linux_public_ip" {
  value = openstack_networking_floatingip_v2.vm_linux_fip.address
}