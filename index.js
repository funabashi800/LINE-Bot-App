const express = require('express')
const app = express()
//const dotenv = require('dotenv')
const moment = require('moment')
//dotenv.config()
require('now-env')

const dialogflow = require('./plugins/dialogflow').default
const firestore = require('./plugins/firebase').default
const config = require('./plugins/line').default
const Message = require('./message')
const line = require('@line/bot-sdk')
const postHandler = require('./post-handler')
const chancel = require('./chnacel')

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
											
											else if (value == 7){
												if(responses[0].queryResult && responses[0].queryResult.action == "handle-chancel"){
														bot.replyMessage(event.replyToken, msg.reallycancel)
														db[event.source.userId.toString()] = 8
												}
												else{
													bot.replyMessage(event.replyToken, {
														"type": "text",
            								"text": "了解です！面談日程の変更はLINE@からできます！"
													}).then(() => {
														delete db[event.source.userId.toString()]
													})
												}
											}

											else if (value == 8){
												if(event.message.text == "はい"){
													bot.replyMessage(event.replyToken, msg.goodby)
													bot.getProfile(event.source.userId).then(profile => {
														value = db[`${event.source.userId.toString()}-date`]
														chancel(profile.displayName, profile.pictureUrl, value, event.source.userId)
														delete db[`${event.source.userId.toString()}-date`]
													})
												}
												else{
													bot.replyMessage(event.replyToken, {
														"type": "text",
            								"text": "了解です！面談日程の変更はLINE@からできます！"
													})
												}
												delete db[event.source.userId.toString()]
												
											}

											else if (value == 4){
												if (["化学", "食品", "電機メーカー", "総合商社", "ソフトウェア", "インターネットサービス", "建設", "その他"].includes(event.message.text)){
													// 都合のいい日程を教えて
													bot.replyMessage(event.replyToken, msg.datepicker)
													db[`${event.source.userId.toString()}-field`] = event.message.text
												}
												else{
													bot.replyMessage(event.replyToken, msg.misstake)
												}
											}
											else{
												// どゆこと？
												bot.replyMessage(event.replyToken, msg.cantunderstand)
												delete db[event.source.userId.toString()]
											}
                    })
								}
								else if (event.type === "postback"){
									if (event.postback.data == "date"){
										bot.replyMessage(event.replyToken, msg.timepicker)
										db[`${event.source.userId.toString()}-date`] = event.postback.params.date
									}
									else if (event.postback.data == "time"){
										bot.replyMessage(event.replyToken, msg.finish).then(() => {
											bot.getProfile(event.source.userId).then(profile => {
												db[`${event.source.userId.toString()}-name`] = profile.displayName
												db[`${event.source.userId.toString()}-url`] = profile.pictureUrl
												db[`${event.source.userId.toString()}-time`] = event.postback.params.time
											})
											.then(() => {
												var user_data = {
													name: db[`${event.source.userId.toString()}-name`],
													url: db[`${event.source.userId.toString()}-url`],
													department: db[`${event.source.userId.toString()}-department`],
													grade: db[`${event.source.userId.toString()}-grade`],
													field: db[`${event.source.userId.toString()}-field`],
													date: db[`${event.source.userId.toString()}-date`]
												}
												postHandler(user_data, event.source.userId)
												delete db[event.source.userId.toString()]
												delete db[`${event.source.userId.toString()}-name`]
												delete db[`${event.source.userId.toString()}-url`]
												delete db[`${event.source.userId.toString()}-department`]
												delete db[`${event.source.userId.toString()}-grade`]
												delete db[`${event.source.userId.toString()}-field`]
												delete db[`${event.source.userId.toString()}-date`]

											})
										})
									}
								}
            }
            else{
							var docRef = firestore.collection("enter").doc(event.source.userId)
							docRef.get().then(doc => {
								if(doc.exists){
									if( new Date(doc.data().date).getTime() >= new Date(moment().format('Y-MM-DD')).getTime() ){
										// キャンセル？日程変更？
										bot.replyMessage(event.replyToken, {
											"type": "template",
											"altText": "this is a confirm template",
											"template": {
													"type": "confirm",
													"actions": [
															{
																	"type": "message",
																	"label": "しない",
																	"text": "しない"
															},
															{
																	"type": "message",
																	"label": "キャンセルしたい",
																	"text": "キャンセルしたい"
															}
													],
													"text": `お久しぶりです。次回面接日程は${moment(doc.data().date).format('M月D日')} ${moment(doc.data().time).format('h時mm分')}です。キャンセルしますか？`
											}
										})
										db[event.source.userId.toString()] = 7
										db[`${event.source.userId.toString()}-date`] = doc.data().date
									}
									// 登録済みだけど、面談は終了している
									else{
										bot.replyMessage(event.replyToken, msg.check_interview)
										db[event.source.userId.toString()] = 1
									}
								}
								else{
									bot.replyMessage(event.replyToken, msg.check_interview)
									db[event.source.userId.toString()] = 1
								}
							})
						}
        }))
})


app.listen(process.env.PORT || 9000);