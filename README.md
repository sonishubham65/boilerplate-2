# Start application on local

`docker-compose up`
`npm run migration:run`
`npm run start:dev`

### baseuri: <https://localhost:3000/v1>

# Authentication

- Open this url and you will be redirected to facebook and once login, you will be back on localhost:3000 and getting access token
<http://localhost:3000/v1/auth/facebook/>

# Test cases

`npm run test -f post.controller.spec.ts`
`npm run test -f post.service.spec.ts`
`npm run test:e2e -f product.e2e-spec.ts`

- Error handling
`http://localhost:3000/v1/error/1`
`http://localhost:3000/v1/error/2`
`http://localhost:3000/v1/error/3`

# DTO

- post.controller.ts, create function, /v1/post -> create api

# Fake data generate

- on Main.ts, written function code, simply call the function fakeData


## Terraform

- RUN `docker build --network=host -t jktech .`
- RUN `docker tag jktech gcr.io/jktech-387515/jktech`
- RUN `gcloud auth configure-docker`
- RUN `docker push gcr.io/jktech-387515/jktech`

- Enable GKE & setup serviceaccount.json
- export PATH="$PATH:/Users/shubhamsoni/Documents/ecommerce/backend/terraform"
- chmod +x /Users/shubhamsoni/Documents/ecommerce/backend/terraform
- export GOOGLE_APPLICATION_CREDENTIALS=/Users/shubhamsoni/Documents/ecommerce/backend/serviceaccount.json
- mkdir terraform-script
- cd terraform-script
- terraform init
- add main.tf and configuration
- Run `terraform init`
Terraform has been successfully initialized!
You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.
If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
- RUN `terraform fmt -check`
- RUN `terraform validate`
- RUN terraform init -upgrade
===
- RUN `terraform plan -destroy`
- RUN `terraform destroy`
===

- KUBECONFIG=/Users/shubhamsoni/Documents/ecommerce/backend/kube.config gcloud container clusters get-credentials my-cluster --region asia-east1-a --project jktech-387515

- RUN `TF_HTTP_TIMEOUT=10m TF_LOG=debug terraform apply`

kubectl get pods
kubectl exec -it redis-deployment-796948d4d9-tnqg2 -- /bin/bash
redis-cli
KEYS *
