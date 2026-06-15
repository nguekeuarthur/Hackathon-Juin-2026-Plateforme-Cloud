output "vm_id"   { value = openstack_compute_instance_v2.vm.id }
output "vm_ip"   { value = openstack_compute_instance_v2.vm.access_ip_v4 }
output "vm_name" { value = openstack_compute_instance_v2.vm.name }
