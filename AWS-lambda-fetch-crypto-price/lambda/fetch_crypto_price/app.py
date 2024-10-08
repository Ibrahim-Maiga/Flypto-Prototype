import os
import json
import boto3
import requests
import logging
from datetime import datetime, timezone
import time
from decimal import Decimal

logger = logging.getLogger()
logger.setLevel(os.getenv("LOG_LEVEL", "INFO").upper())

# Define the list of cryptocurrencies and their symbols
cryptos = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "Binance Coin": "BNB",
    "Solana": "SOL",
    "USD Coin": "USDC",
    "Ripple": "XRP",
    "Dogecoin": "DOGE",
    "Toncoin": "TON",
    "Cardano": "ADA",
}

# Initialize DynamoDB client
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(
    os.getenv("DYNAMODB_TABLE", "andytang-prod-aws-lambda-crypto-price")
)

# Define the base symbols you want to fetch (without the 'USDT' suffix)
crypto_symbols = ["BTC", "ETH", "BNB"]  # Add more symbols as needed


def fetch_crypto_data(symbol, interval="1d", limit=5):
    params = {"symbol": symbol + "USDT", "interval": interval, "limit": limit}
    response = requests.get("https://api.binance.com/api/v3/klines", params=params)
    response.raise_for_status()
    return response.json()


def save_data_in_dynamodb(symbol, data):
    for item in data:
        timestamp = datetime.utcfromtimestamp(item[0] // 1000)
        iso_timestamp = timestamp.isoformat() + "Z"
        closing_price = Decimal(str(item[4]))
        ttl = int(time.time()) + 365 * 24 * 60 * 60  # 365 days

        # Prepare the item to store in DynamoDB
        dynamo_item = {
            "Symbol": symbol,
            "Date": iso_timestamp,
            "Close": closing_price,
            "TTL": ttl,
        }

        print(dynamo_item)

        # Store the item in DynamoDB
        table.put_item(Item=dynamo_item)


def lambda_handler(event, context):
    try:
        logger.info("Lambda function started")
        for _, symbol in cryptos.items():
            crypto_data = fetch_crypto_data(symbol)
            save_data_in_dynamodb(symbol, crypto_data)

            logger.info(f"Sleeping 1 second before the next API call")
            time.sleep(1)

        logger.info("All data processed and stored successfully")
        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "All data processed and stored successfully",
                    "data": crypto_data,
                }
            ),
        }

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}
