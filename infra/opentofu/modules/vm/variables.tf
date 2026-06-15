variable "name" {
  type = string
}

variable "image_name" {
  type    = string
  default = "Ubuntu 22.04 LTS Jammy Jellyfish"
}

variable "flavor_name" {
  type    = string
  default = "a1-ram2-disk20-perf1"
}

variable "key_pair_name" {
  type = string
}

variable "network_name" {
  type = string
}

variable "course" {
  type = string
}

variable "owner_email" {
  type = string
}

variable "ends_at" {
  type = string
}

variable "request_id" {
  type = string
}