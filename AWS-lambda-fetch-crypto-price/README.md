# lambda-fetch-crypto-price

This project contains an AWS lambda function written in Python which fetches the latest crypto prices from the Internet (through a free Binance API) and stores it in an Amazon DynamoDB database.

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
