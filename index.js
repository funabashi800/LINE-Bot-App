const express = require('express')
const app = express()
//const dotenv = require('dotenv')
//dotenv.config()
require('now-env')

const dialogflow = require('./plugins/dialogflow').default
const firestore = require('./plugins/firebase').default
const config = require('./plugins/line').default
const Message = require('./message')
const line = require('@line/bot-sdk')
const postHandler = require('./post-handler')

const msg = new Message()

const bot = new line.Client(config)

var db = {}

app.post('/bot/webhook', line.middleware(config), (req, res, next) => {
		res.sendStatus(200);
    Promise
        .all(req.body.events.forEach(event => {
			value = db[event.source.userId.toString()]
            if (value > 0){
                if(event.type == "message" && event.message.type == "text"){
                    dialogflow.detectIntent({
                        session: dialogflow.sessionPath(process.env.GOOGLE_PROJECT_ID, event.source.userId),
                        queryInput: {
                            text: {
                                text: event.message.text,
                                languageCode: "ja",
                            }
                        }
                    })
                    .then( responses => {
											if (value == 1){
												if (event.message.text == "相談したい"){
													// 学部を教えて！
													bot.replyMessage(event.replyToken, msg.department)
													db[event.source.userId.toString()] = 2
												}
												else{
													bot.replyMessage(event.replyToken, msg.goodby)
													delete db[event.source.userId.toString()]
												}
											}
											
											else if (value == 2){
												if (responses[0].queryResult && responses[0].queryResult.action == "handle-department"){
														// 学年を教えて！
														bot.replyMessage(event.replyToken, msg.grade)
														db[event.source.userId.toString()] = 3
														db[`${event.source.userId}-department`] = responses[0].queryResult.parameters.fields.department.stringValue
													}
													else{
														bot.replyMessage(event.replyToken, msg.misstake)
													}
												}

											else if (value == 3){
												if (responses[0].queryResult && responses[0].queryResult.action == "handle-grade"){
													
														// 志望業界を教えて
														bot.replyMessage(event.replyToken, msg.field)
														db[event.source.userId.toString()] = 4
														db[`${event.source.userId}-grade`] = responses[0].queryResult.parameters.fields.grade.stringValue
												}
												else{
													bot.replyMessage(event.replyToken, msg.misstake)
												}
											}

											else if (value == 4){
												if (["化学", "食品", "電機メーカー", "総合商社", "ソフトウェア", "インターネットサービス", "建設", "重工","その他"].includes(event.message.text)){
													// 都合のいい日程を教えて
													bot.replyMessage(event.replyToken, msg.question)
													db[event.source.userId.toString()] = 5
													db[`${event.source.userId.toString()}-field`] = event.message.text
													db[`${event.source.userId.toString()}-question`] = []
												}
												else{
													bot.replyMessage(event.replyToken, msg.misstake)
												}
											}
											// 一回目の質問が回答された。他に質問ある？
											else if (value == 5){
												db[`${event.source.userId.toString()}-question`].push(event.message.text)
												bot.replyMessage(event.replyToken, msg.anotherquestion)
												db[event.source.userId.toString()] = 6
											}
											// はい？ー＞質問内容は？　いいえ？ー＞提出
											else if (value == 6){
												// 質問内容は？
												if(event.message.text == "はい"){
													db[event.source.userId.toString()] = 5
													bot.replyMessage(event.replyToken, msg.question)
												}
												// 提出
												else{
													bot.replyMessage(event.replyToken, msg.finish).then(() => {
														bot.getProfile(event.source.userId).then(profile => {
															db[`${event.source.userId.toString()}-name`] = profile.displayName
															db[`${event.source.userId.toString()}-url`] = profile.pictureUrl
														})
														.then(() => {
															var user_data = {
																name: db[`${event.source.userId.toString()}-name`],
																url: db[`${event.source.userId.toString()}-url`],
																department: db[`${event.source.userId.toString()}-department`],
																grade: db[`${event.source.userId.toString()}-grade`],
																field: db[`${event.source.userId.toString()}-field`],
																question: db[`${event.source.userId.toString()}-question`]
															}
															postHandler(user_data, event.source.userId)
															delete db[event.source.userId.toString()]
															delete db[`${event.source.userId.toString()}-name`]
															delete db[`${event.source.userId.toString()}-url`]
															delete db[`${event.source.userId.toString()}-department`]
															delete db[`${event.source.userId.toString()}-grade`]
															delete db[`${event.source.userId.toString()}-field`]
															delete db[`${event.source.userId.toString()}-question`]
														})
													})
												}
											}

											else if (value == 7){
													// 志望業界を教えて
													if (event.message.text == "相談したい"){
														bot.replyMessage(event.replyToken, msg.field)
														db[event.source.userId.toString()] = 8
													}
													else{
														bot.replyMessage(event.replyToken, msg.goodby)
														delete db[event.source.userId.toString()]
													}
													
											}

											else if (value == 8){
												if (["化学", "食品", "電機メーカー", "総合商社", "ソフトウェア", "インターネットサービス", "建設", "重工","その他"].includes(event.message.text)){
													// 都合のいい日程を教えて
													bot.replyMessage(event.replyToken, msg.question)
													db[event.source.userId.toString()] = 9
													db[`${event.source.userId.toString()}-field`] = event.message.text
													db[`${event.source.userId.toString()}-question`] = []
												}
												else{
													bot.replyMessage(event.replyToken, msg.misstake)
												}
											}

											else if (value == 9){
												db[`${event.source.userId.toString()}-question`].push(event.message.text)
												bot.replyMessage(event.replyToken, msg.anotherquestion)
												db[event.source.userId.toString()] = 10
											}

											else if (value == 10){
												if(event.message.text == "ある"){
													db[event.source.userId.toString()] = 9
													bot.replyMessage(event.replyToken, msg.question)
												}
												else{
													bot.replyMessage(event.replyToken, msg.finish).then(() => {
														bot.getProfile(event.source.userId).then(profile => {
															db[`${event.source.userId.toString()}-name`] = profile.displayName
															db[`${event.source.userId.toString()}-url`] = profile.pictureUrl
														})
														.then(() => {
															var user_data = {
																name: db[`${event.source.userId.toString()}-name`],
																url: db[`${event.source.userId.toString()}-url`],
																field: db[`${event.source.userId.toString()}-field`],
																question: db[`${event.source.userId.toString()}-question`]
															}
															postHandler(user_data, event.source.userId)
															delete db[event.source.userId.toString()]
															delete db[`${event.source.userId.toString()}-name`]
															delete db[`${event.source.userId.toString()}-url`]
															delete db[`${event.source.userId.toString()}-field`]
															delete db[`${event.source.userId.toString()}-question`]
														})
													})
												}
											}
											else{
												// どゆこと？
												bot.replyMessage(event.replyToken, msg.cantunderstand)
												delete db[event.source.userId.toString()]
											}
                    })
								}
            }
            else{
							var docRef = firestore.collection("enter").doc(event.source.userId)
							docRef.get().then(doc => {
								if(doc.exists){
									bot.replyMessage(event.replyToken, msg.ohisashiburi)
									db[event.source.userId.toString()] = 7
								}
								else{
									bot.replyMessage(event.replyToken, msg.check_interview)
									db[event.source.userId.toString()] = 1
								}
							})
						}
        }))
})


app.listen(process.env.PORT || 3000);