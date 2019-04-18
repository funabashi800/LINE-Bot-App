const slack_client = require('./plugins/slack').default
const firestore = require('./plugins/firebase').default

module.exports = function postHandler(data, id){
    try{         
        if(data.grade){
            firestore.collection("enter").doc(id).set(data);
            slack_client.sendAttachment({
            author_name: data.name,
            author_icon: data.url,
            fallback:"新しいエンターが現れたよ",
            color:"#D00000",
            fields:[
                {
                    title:`${data.department}の${data.grade}です`,
                    value:`志望業界は${data.field}です! 相談内容は${data.question[0]}とかです`
                }
            ]
            })
        }
        else{
            var docRef = firestore.collection("enter").doc(id)
		    docRef.get().then(doc => {
                var grade = doc.data().grade
                var department = doc.data().department
                slack_client.sendAttachment({
                    author_name: data.name,
                    author_icon: data.url,
                    fallback:"再びエンターが面談を申し込んできた",
                    color:"#D00000",
                    fields:[
                        {
                            title:`${department}の${grade}です`,
                            value:`志望業界は${data.field}です! 相談内容は${data.question[0]}とかです`
                        }
                    ]
                })
            })
            docRef.update({
                "field": field,
                "question": data.question
            })
        }

    }
    catch(e){
        console.log(e)
    }
}