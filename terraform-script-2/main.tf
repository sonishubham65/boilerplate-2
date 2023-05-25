# Google provider Credentials
provider "google" {
  credentials = file("/Users/shubhamsoni/Documents/ecommerce/backend/serviceaccount.json")
  project     = "jktech-387515"
  region      = "asia-south2-a"
}


#Create a Google-managed SSL certificate
# resource "google_compute_managed_ssl_certificate" "managed_ssl_cert" {
#   name        = "your-ssl-cert-2"
#   description = "SSL certificate for sonishubham.com"
#   managed {
#     domains = ["sonishubham.com"]
#   }
# }


resource "kubernetes_secret" "managed_ssl_cert" {
  metadata {
    name      = "your-ssl-cert-2"
    namespace = "default"
  }

  data = {
    "tls.crt" = filebase64("/Users/shubhamsoni/Documents/ecommerce/backend/certs/fullchain.pem")
    "tls.key" = filebase64("/Users/shubhamsoni/Documents/ecommerce/backend/certs/privkey.pem")
  }

  type = "kubernetes.io/tls"
}


# resource "google_dns_managed_zone" "dns_zone" {
#   depends_on = [kubernetes_ingress_v1.nestjs_ingress]
#   name        = "your-dns-zone"
#   dns_name    = "sonishubham.com."
#   description = "DNS zone for sonishubham.com"
#   dnssec_config {
#     state = "on"
#   }
# }

# Create a Kubernetes cluster
resource "google_container_cluster" "kubernetes_cluster" {
  name     = "my-cluster-2"
  location = "asia-south2-a"

  node_pool {
    name = "my-node-pool"
    node_config {
      machine_type = "n1-standard-1"
      disk_size_gb = 50
    }
    initial_node_count = 3

    autoscaling {
      min_node_count = 1
      max_node_count = 5
    }
  }
}

// TODO: Save all the kubernetes config in kube.config

# Use manually created Kube config to enter Kubernetes
provider "kubernetes" {
  config_path = "/Users/shubhamsoni/Documents/ecommerce/backend/kube.config"
  #config_context = "my-context"
}

# Create PostgreSQL Secret
resource "kubernetes_secret" "postgres_secret" {
  metadata {
    name = "postgres-credentials"
  }

  data = {
    POSTGRES_USER     = base64encode("postgres")
    POSTGRES_PASSWORD = base64encode("pass123")
  }

  depends_on = [google_container_cluster.kubernetes_cluster]
}

# Create Redis Secret
resource "kubernetes_secret" "redis_secret" {
  metadata {
    name = "redis-credentials"
  }

  data = {
    REDIS_PASSWORD = base64encode("password")
  }

  depends_on = [google_container_cluster.kubernetes_cluster]
}

resource "kubernetes_secret" "env" {
  metadata {
    name = "env"
  }

  data = {
    "NODE_ENV" = base64encode("docker")
  }

  depends_on = [google_container_cluster.kubernetes_cluster]
}

# Deploy Redis workload
resource "kubernetes_deployment" "redis_deployment" {
  metadata {
    name = "redis-deployment"
    labels = {
      app = "redis"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "redis"
      }
    }

    template {
      metadata {
        labels = {
          app = "redis"
        }
      }

      spec {
        container {
          image = "redis:latest"
          name  = "redis-container"

          env {
            name  = "REDIS_PASSWORD"
            value = base64decode(kubernetes_secret.redis_secret.data["REDIS_PASSWORD"])
          }
        }
      }
    }
  }

  depends_on = [google_container_cluster.kubernetes_cluster]
}

# Deploy PostgreSQL workload
resource "kubernetes_deployment" "postgres_deployment" {
  metadata {
    name = "postgres-deployment"
    labels = {
      app = "postgres"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "postgres"
      }
    }

    template {
      metadata {
        labels = {
          app = "postgres"
        }
      }

      spec {
        container {
          image = "postgres:latest"
          name  = "postgres-container"

          env {
            name  = "POSTGRES_USER"
            value = base64decode(kubernetes_secret.postgres_secret.data["POSTGRES_USER"])
          }

          env {
            name  = "POSTGRES_PASSWORD"
            value = base64decode(kubernetes_secret.postgres_secret.data["POSTGRES_PASSWORD"])
          }
        }
      }
    }
  }

  depends_on = [google_container_cluster.kubernetes_cluster]
}

# Deploy Nest.js application using Dockerfile
resource "kubernetes_deployment" "nestjs_deployment" {
  metadata {
    name = "nestjs-deployment"
    labels = {
      app = "nestjs"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "nestjs"
      }
    }

    template {
      metadata {
        labels = {
          app = "nestjs"
        }
      }

      spec {
        container {
          image = "gcr.io/jktech-387515/jktech"
          name  = "jktech"

          env {
            name  = "NODE_ENV"
            value = "docker"
          }
        }
      }
    }
  }

  # Specify the explicit dependency on other resources
  depends_on = [
    kubernetes_deployment.redis_deployment,
    kubernetes_deployment.postgres_deployment,
  ]
}

# Expose Nest.js deployment with a LoadBalancer service
resource "kubernetes_service" "nestjs_service" {
  metadata {
    name = "nestjs-service"
  }

  spec {
    selector = {
      app = kubernetes_deployment.nestjs_deployment.metadata[0].labels.app
    }

    type = "NodePort"

    port {
      port        = 80
      target_port = 3000
    }
  }

  depends_on = [kubernetes_deployment.nestjs_deployment]
}


# Expose Nest.js deployment with an Ingress resource
resource "kubernetes_ingress_v1" "nestjs_ingress" {
  depends_on = [kubernetes_service.nestjs_service]
  metadata {
    name = "nestjs-ingress-2"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer"      = "letsencrypt-prod"
      "kubernetes.io/ingress.global-static-ip-name": "jk-ip"
    }
  }

  spec {
    ingress_class_name = "nginx"
    tls {
        secret_name = "your-ssl-cert-2"
        hosts = [
            "sonishubham.com",
            "www.sonishubham.com"
        ]

    }
    default_backend {
      service {
        name = "nestjs-service"
        port {
          number = 80
        }
      }
    }
  }
}

data "google_compute_global_address" "static_ip" {
  name = "jk-ip"
}

# resource "google_dns_record_set" "a_record" {
#   name         = "sonishubham.com."
#   type         = "A"
#   ttl          = 300
#   managed_zone = "your-dns-zone"

#   rrdatas = [
#     kubernetes_ingress_v1.nestjs_ingress.status.0.load_balancer.0.ingress.0.ip
#     #data.google_compute_global_address.static_ip.address
#   ]
# }


# Define HorizontalPodAutoscaler (HPA) for Nest.js deployment
resource "kubernetes_horizontal_pod_autoscaler" "nestjs_hpa" {
  metadata {
    name = "nestjs-hpa"
  }

  spec {
    scale_target_ref {
      kind = "Deployment"
      name = kubernetes_deployment.nestjs_deployment.metadata[0].name
    }

    min_replicas = 1
    max_replicas = 5

    target_cpu_utilization_percentage = 80
  }
}

# Expose Redis service
resource "kubernetes_service" "redis_service" {
  metadata {
    name = "redis-service"
  }

  spec {
    selector = {
      app = kubernetes_deployment.redis_deployment.metadata[0].labels.app
    }

    type = "ClusterIP"

    port {
      port        = 6379
      target_port = 6379
    }
  }

  depends_on = [kubernetes_deployment.redis_deployment]
}

# Expose PostgreSQL service
resource "kubernetes_service" "postgres_service" {
  metadata {
    name = "postgres-service"
  }

  spec {
    selector = {
      app = kubernetes_deployment.postgres_deployment.metadata[0].labels.app
    }

    type = "ClusterIP"

    port {
      port        = 5432
      target_port = 5432
    }
  }

  depends_on = [kubernetes_deployment.postgres_deployment]
}





# resource "local_file" "kubeconfig" {
#   depends_on = [google_container_cluster.kubernetes_cluster]
#   filename   = "/Users/shubhamsoni/Documents/ecommerce/backend/kube.config"
#   content = templatefile("/Users/shubhamsoni/Documents/ecommerce/backend/kubeconfig.tpl", {
#     cluster_ca_certificate = base64encode(google_container_cluster.kubernetes_cluster.master_auth.0.cluster_ca_certificate)
#     cluster_endpoint               = google_container_cluster.kubernetes_cluster.endpoint
#     cluster_client_certificate     = base64encode(google_container_cluster.kubernetes_cluster.master_auth.0.client_certificate)
#     cluster_client_key             = base64encode(google_container_cluster.kubernetes_cluster.master_auth.0.client_key)
#   })
# }


# resource "local_file" "kubeconfig" {
#     depends_on = [google_container_cluster.kubernetes_cluster]
#   filename = "/Users/shubhamsoni/Documents/ecommerce/backend/kube.config"
#   content = <<-EOF
# apiVersion: v1
# kind: Config
# clusters:
# - name: my-cluster-2
#   cluster:
#     server: ${google_container_cluster.kubernetes_cluster.endpoint}
#     certificate-authority-data: ${google_container_cluster.kubernetes_cluster.master_auth.0.cluster_ca_certificate}
# users:
# - name: my-user
#   user:
#     client-certificate-data: ${google_container_cluster.kubernetes_cluster.master_auth.0.client_certificate}
#     client-key-data: ${google_container_cluster.kubernetes_cluster.master_auth.0.client_key}
# contexts:
# - name: my-context
#   context:
#     cluster: my-cluster-2
#     user: my-user
#   EOF
# }

# output "client_certificate" {
#   value = google_container_cluster.kubernetes_cluster.master_auth[0].client_certificate
# }

# output "client_key" {
#   value = google_container_cluster.kubernetes_cluster.master_auth[0].client_key
# }




# resource "null_resource" "my-context" {
#   depends_on = [google_container_cluster.kubernetes_cluster]
#   triggers = {
#     timestamp = timestamp()
#   }

#   provisioner "local-exec" {
#     command = <<-EOT
#       # Create a new context
#       kubectl config set-context my-context --cluster=my-cluster-2 --user=my-user

#       # Set the current-context to the newly created context
#       kubectl config use-context my-context
#     EOT
#   }
# }

# resource "google_compute_url_map" "my_url_map" {
#   name        = "my-url-map"
#   default_service = google_compute_backend_service.nestjs_service.self_link
# }

# resource "google_compute_target_https_proxy" "my_https_proxy" {
#   name    = "my-https-proxy"
#   url_map = google_compute_url_map.my_url_map.self_link
# }
# resource "google_compute_forwarding_rule" "my_forwarding_rule" {
#   name                  = "my-forwarding-rule"
#   target                = google_compute_target_https_proxy.my_https_proxy.self_link
#   load_balancing_scheme = "EXTERNAL"
#   port_range            = "443"
# }