# Define provider
provider "google" {
  credentials = file("/Users/shubhamsoni/Documents/ecommerce/backend/serviceaccount.json")
  project     = "jktech-387515"
  region      = "asia-east1-a"
}
provider "kubernetes" {
  config_path = "/Users/shubhamsoni/Documents/ecommerce/backend/kubeconfig"
}
# Create a Kubernetes cluster
resource "google_container_cluster" "kubernetes_cluster" {
  name     = "my-cluster"
  location = "asia-east1-a"

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
            value = base64decode(kubernetes_secret.redis_password.data["redis-password"])
          }
        }

      }

    }
  }
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
}

# Expose Nest.js deployment with a LoadBalancer service
resource "kubernetes_service" "nestjs_service" {
  metadata {
    name = "nestjs-service"
  }

  spec {
    selector = {
      app = kubernetes_deployment.nestjs_deployment.metadata.0.labels.app
    }

    type = "LoadBalancer"

    port {
      port        = 80
      target_port = 3000
    }
  }
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
            value = base64decode(kubernetes_secret.env.data["NODE_ENV"])
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


# Define HorizontalPodAutoscaler (HPA) for Nest.js deployment
resource "kubernetes_horizontal_pod_autoscaler" "nestjs_hpa" {
  metadata {
    name = "nestjs-hpa"
  }

  spec {
    scale_target_ref {
      kind = "Deployment"
      name = kubernetes_deployment.nestjs_deployment.metadata.0.name
    }

    min_replicas = 1
    max_replicas = 5

    target_cpu_utilization_percentage = 80
  }
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
}

# Create Redis Secret
resource "kubernetes_secret" "redis_password" {
  metadata {
    name = "redis-credentials"
  }

  data = {
    "redis-password" = base64encode("password")
  }
}

resource "kubernetes_secret" "env" {
  metadata {
    name = "env"
  }

  data = {
    "NODE_ENV" = base64encode("docker")
  }
}

# Output PostgreSQL username and password
# output "postgres_username" {
#   value = base64decode(kubernetes_secret.postgres_secret.data["POSTGRES_USER"])
# }

# output "postgres_password" {
#   value = base64decode(kubernetes_secret.postgres_secret.data["POSTGRES_PASSWORD"])
# }

# # Output Redis password
# output "redis_password" {
#   value = kubernetes_secret.redis_password.data["redis-password"]
# }
