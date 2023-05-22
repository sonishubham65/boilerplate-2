provider "google" {
  credentials = file("/Users/shubhamsoni/Documents/ecommerce/backend/serviceaccount.json")
  project     = "boilerplate-353216"
  region      = "asia-south2-a"
}

resource "google_container_cluster" "my_cluster" {
  name               = "my-cluster"
  location           = "asia-south2-a"

  remove_default_node_pool = true

  node_pool {
    name       = "default-pool"
    initial_node_count = 2
  }
}