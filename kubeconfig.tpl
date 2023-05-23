apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: ${cluster_ca_certificate}
    server: ${cluster_endpoint}
  name: my-cluster
contexts:
- context:
    cluster: my-cluster
    user: my-user
  name: my-context
current-context: my-context
preferences: {}
users:
- name: my-user
  user:
    client-certificate-data: ${cluster_client_certificate}
    client-key-data: ${cluster_client_key}