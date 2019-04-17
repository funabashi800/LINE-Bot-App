const { SlackWebhookClient } = require('messaging-api-slack')
require('dotenv').config()

exports.default = SlackWebhookClient.connect(process.env.SLACK_BASE_URL)