require('dotenv').config()

const config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret:  process.env.LINE_CHANNEL_SECRET
}

exports.default = config