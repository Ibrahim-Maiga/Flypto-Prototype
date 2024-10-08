resource "null_resource" "install_dependencies" {
  triggers = {
    always_run = "${timestamp()}"
  }
  provisioner "local-exec" {
    command = <<EOT
    pip install -r ../lambda/fetch_crypto_price/requirements.txt -t ../lambda/fetch_crypto_price/
    EOT
  }
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "../lambda/fetch_crypto_price/"
  output_path = "lambda_function.zip"
  depends_on  = [null_resource.install_dependencies]
}

resource "null_resource" "cleanup_dependencies" {
  triggers = {
    always_run = "${timestamp()}"
  }
  provisioner "local-exec" {
    command = <<EOT
    find ../lambda/fetch_crypto_price ! -path '../lambda/fetch_crypto_price/app.py' ! -path '../lambda/fetch_crypto_price/requirements.txt' ! -path '../lambda/fetch_crypto_price/.gitignore' ! -path '../lambda/fetch_crypto_price' -exec rm -rf {} + || true
    EOT
  }
  depends_on = [data.archive_file.lambda_zip]
}


module "label_lambda" {
  source      = "git::https://github.com/cloudposse/terraform-null-label.git?ref=main"
  namespace   = var.namespace
  environment = var.environment
  stage       = var.stage
  name        = "lambda"
  label_order = ["namespace", "stage", "environment", "name", "attributes"]
  tags = {
    "Terraform" = "true"
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "${module.label_lambda.id}-fetch-crypto-price-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
      },
    ],
  })
}

resource "aws_iam_policy" "lambda_execution_role_policy" {
  name        = "${module.label_lambda.id}-fetch-crypto-price-role-policy"
  description = "IAM policy for Lambda role"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem"
        ],
        Resource = aws_dynamodb_table.crypto_price.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_execution_role_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_execution_role_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logging_policy" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "lambda_function" {
  function_name    = "${module.label_lambda.id}-fetch-crypto-price"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "app.lambda_handler"
  runtime          = "python3.9"
  filename         = data.archive_file.lambda_zip.output_path
  timeout          = 120
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.crypto_price.name
      LOG_LEVEL      = "INFO"
    }
  }
}

output "lambda_function_arn" {
  value = aws_lambda_function.lambda_function.arn
}
