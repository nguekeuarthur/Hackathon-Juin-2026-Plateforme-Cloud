# Generate a new SSH key specifically for this VM
resource "tls_private_key" "ssh" {
  algorithm = "ED25519"
}

resource "openstack_compute_keypair_v2" "keypair" {
  name       = "${var.vm_name}-key"
  public_key = tls_private_key.ssh.public_key_openssh
}

resource "openstack_networking_secgroup_v2" "sg" {
  name        = "${var.vm_name}-sg"
  description = "Security group for VM"
}

resource "openstack_networking_secgroup_rule_v2" "ssh_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 22
  port_range_max    = 22
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.sg.id
}

resource "openstack_networking_secgroup_rule_v2" "icmp_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "icmp"
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.sg.id
}

resource "openstack_compute_instance_v2" "vm" {
  name            = var.vm_name
  flavor_name     = var.flavor_name
  image_id        = var.template_id
  key_pair        = openstack_compute_keypair_v2.keypair.name
  security_groups = [openstack_networking_secgroup_v2.sg.name]

  network {
    name = "ext-net1" # Required on Infomaniak public cloud for an external IP
  }
}

output "vm_ip" {
  value = openstack_compute_instance_v2.vm.access_ip_v4
}

output "private_key" {
  value     = tls_private_key.ssh.private_key_openssh
  sensitive = true
}
