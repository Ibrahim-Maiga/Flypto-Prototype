resource "aws_cloudwatch_event_rule" "daily_trigger" {
  name                = "daily_lambda_trigger"
  description         = "Triggers Lambda function every day at 1 AM UTC"
  schedule_expression = "cron(0 1 * * ? *)" # Trigger at 1 AM UTC every day
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_trigger.arn
}

resource "aws_cloudwatch_event_target" "trigger_lambda" {
  rule      = aws_cloudwatch_event_rule.daily_trigger.name
  target_id = aws_lambda_function.lambda_function.function_name
  arn       = aws_lambda_function.lambda_function.arn
}
