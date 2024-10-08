import { NextRequest, NextResponse } from 'next/server'

import { getLastTwoDates } from '@/lib/features/crypto/cryptoAPI'
import AWS from 'aws-sdk'
import moment from 'moment'

// AWS SDK configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export async function GET(request: NextRequest) {
  const dates = getLastTwoDates()

  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE || '',
    FilterExpression: '#date IN (:today, :yesterday)',
    ExpressionAttributeNames: {
      '#date': 'Date',
    },
    ExpressionAttributeValues: {
      ':today': dates[0].format('YYYY-MM-DDTHH:mm:ss') + 'Z',
      ':yesterday': dates[1].format('YYYY-MM-DDTHH:mm:ss') + 'Z',
    },
  }

  try {
    const data = await dynamoDb.scan(params).promise()
    return NextResponse.json(data.Items)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching records from DynamoDB' }, { status: 500 })
  }
}
