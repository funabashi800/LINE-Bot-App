const slack_client = require('./plugins/slack').default
const firestore = require('./plugins/firebase').default

module.exports = function postHandler(data, id){
    try{
        firestore.collection("enter").doc(id).set(data);
        slack_client.sendAttachment({
            author_name: data.name,
            author_icon: data.url,
            fallback:"新しいエンターが現れたよ",
            color:"#D00000",
            fields:[
                {
                    title:`${data.department}の${data.grade}です`,
                    value:`${data.date},${data.time}に面談したいです。志望業界は${data.field}です`
                }
            ]
        })
    }
    catch(e){
        console.log(e)
    }
}