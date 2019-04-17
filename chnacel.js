const slack_client = require('./plugins/slack').default
const firestore = require('./plugins/firebase').default

module.exports = function chancel(name, url, date, id){
    try{
        firestore.collection("enter").doc(id).update({
            date: '1995-12-25'
        })
        slack_client.sendAttachment({
            author_name: name,
            author_icon: url,
            fallback:"エンターが面談をキャンセルしたよ",
            color:"#D00000",
            fields:[
                {
                    title:`${date}の面談ですが、キャンセルします`,
                    value:'さようなら'
                }
            ]
        })
    }
    catch(e){
        console.log(e)
    }
}