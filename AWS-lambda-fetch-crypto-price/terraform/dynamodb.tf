module "label_dynamodb" {
  source      = "git::https://github.com/cloudposse/terraform-null-label.git?ref=main"
  namespace   = var.namespace
  environment = var.environment
  stage       = var.stage
  name        = "dynamodb"
  label_order = ["namespace", "stage", "environment", "name", "attributes"]
  tags = {
    "Terraform" = "true"
  }
}

resource "aws_dynamodb_table" "crypto_price" {
  name         ="${ module.label_lambda.id}-crypto-price"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "Symbol"
  range_key = "Date"

  attribute {
    name = "Symbol"
    type = "S"
  }

  attribute {
    name = "Date"
    type = "S"
  }

  tags = module.label_lambda.tags

  server_side_encryption {
    enabled = true
  }

  ttl {
    attribute_name = "TTL"
    enabled        = true
  }
}
