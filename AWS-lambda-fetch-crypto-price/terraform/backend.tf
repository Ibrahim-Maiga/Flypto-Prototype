provider "aws" {
  region = "ca-central-1"
}

terraform {
  backend "s3" {
    region = "us-east-1"
  }
}