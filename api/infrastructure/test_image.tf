data "openstack_images_image_v2" "ubuntu" {
  name = "Ubuntu 22.04 LTS"
  most_recent = true
}
data "openstack_images_image_v2" "debian" {
  name = "Debian 12 Bookworm"
  most_recent = true
}
output "ubuntu_id" {
  value = data.openstack_images_image_v2.ubuntu.id
}
output "debian_id" {
  value = data.openstack_images_image_v2.debian.id
}
