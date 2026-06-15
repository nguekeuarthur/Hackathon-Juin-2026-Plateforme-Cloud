terraform {
  required_providers {
    openstack = {
      source  = "terraform-provider-openstack/openstack"
      version = "~> 1.54"
    }
  }
}

resource "openstack_compute_instance_v2" "vm" {
  name            = var.name
  image_name      = var.image_name
  flavor_name     = var.flavor_name
  key_pair        = var.key_pair_name
  security_groups = [openstack_networking_secgroup_v2.vm_sg.name]

  network {
    name = var.network_name
  }

  metadata = {
    course     = var.course
    owner      = var.owner_email
    ends_at    = var.ends_at
    request_id = var.request_id
  }
}

resource "openstack_networking_secgroup_v2" "vm_sg" {
  name        = "${var.name}-sg"
  description = "Security group for ${var.name}"
}

resource "openstack_networking_secgroup_rule_v2" "ssh" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 22
  port_range_max    = 22
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.vm_sg.id
}
