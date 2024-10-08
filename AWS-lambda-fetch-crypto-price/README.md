# lambda-fetch-crypto-price

This project contains an AWS lambda function written in Python which fetchs the latest crypto prices from the Internet and store it in a MongoDB cluster.

The lambda function is managed and deployed with Terraform. It is accessible publicly via AWS API Gateway.

## Quick Start

### Lambda

```bash
$ sam build
$ sam local start-api
```

### Terraform

```bash
$ terraform init -backend-config=backend/prod.tfbackend
$ terraform plan -var-file=vars/prod.tfvars
```
