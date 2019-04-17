const slack_client = require('./plugins/slack').default

module.exports = function slackHandler(user_data){
    try{
        slack_client.sendAttachment({
            author_name: user_data.name,
            author_icon: user_data.url,
            fallback:"新しいエンターが現れたよ",
            color:"#D00000",
            fields:[
                {
                    title:`${user_data.major}の${user_data.grade}です`,
                    value:`${user_data.date},${user_data.time}に面談したいです。志望業界は${user_data.field}です`
                }
            ]
        })
    }
    catch(e){
        console.log(e)
    }
}