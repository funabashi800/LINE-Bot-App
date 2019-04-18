module.exports = class Message{
    constructor(){
        this.check_interview = {
            "type": "template",
            "altText": "this is a confirm template",
            "template": {
                "type": "confirm",
                "actions": [
                    {
                        "type": "message",
                        "label": "相談したい",
                        "text": "相談したい"
                    },
                    {
                        "type": "message",
                        "label": "また今度",
                        "text": "また今度"
                    }
                ],
                "text": "ご連絡ありがとうございます！　しゅうかつ相談を希望しますか？"
            }
        }

        this.timepicker = {
            "type": "template",
            "altText": "this is a buttons template",
            "template": {
                "type": "buttons",
                "title": "空いてる時間教えて!",
                "text": "🙇🙇🙇🙇🙇🙇🙇",
                "actions": [
                    {
                    "type": "datetimepicker",
                    "label": "選択する",
                    "mode": "time",
                    "data": "time"
                    },
                ]
            }
        }

        this.chancel = {
            "type": "template",
            "altText": "this is a confirm template",
            "template": {
                "type": "confirm",
                "actions": [
                    {
                        "type": "message",
                        "label": "",
                        "text": "日程を変更したい"
                    },
                    {
                        "type": "message",
                        "label": "キャンセルしたい",
                        "text": "キャンセルしたい"
                    }
                ],
                "text": "お久しぶりです。次回面接日程は　　です。"
            }
        }
        
        this.reallycancel = {
            "type": "template",
            "altText": "this is a confirm template",
            "template": {
                "type": "confirm",
                "actions": [
                    {
                        "type": "message",
                        "label": "はい",
                        "text": "はい"
                    },
                    {
                        "type": "message",
                        "label": "いいえ",
                        "text": "いいえ"
                    }
                ],
                "text": "間違えました？一から回答しなおしますか？？？"
            }
        }

        this.ohisashiburi = {
            "type": "template",
            "altText": "this is a confirm template",
            "template": {
                "type": "confirm",
                "actions": [
                    {
                        "type": "message",
                        "label": "相談したい",
                        "text": "相談したい"
                    },
                    {
                        "type": "message",
                        "label": "また今度",
                        "text": "また今度"
                    }
                ],
                "text": "お久しぶりです！またメンターとしゅうかつ相談しますか？"
            }
        }

        this.goodby = {
            "type": "text",
            "text": "了解です！　また連絡してください！"
        }

        this.question = {
            "type": "text",
            "text": "相談内容を簡単に教えてください！ \n例：就活ってなに？, 業界悩んでる.." 
        }

        this.anotherquestion = {
            "type": "template",
            "altText": "this is a confirm template",
            "template": {
                "type": "confirm",
                "actions": [
                    {
                        "type": "message",
                        "label": "ある",
                        "text": "ある"
                    },
                    {
                        "type": "message",
                        "label": "ない",
                        "text": "ない"
                    }
                ],
                "text": "他にも相談内容はありますか？"
            } 
        }

        this.misstake = {
            "type": "text",
            "text": "入力内容が間違っているよ！"
        }

        this.cantunderstand = {
            "type": "text",
            "text": "？？？？？ごめん、ぼくができるのは面談の予約だけなんだ。。ごめんな"
        }

        this.department = [
            {
                "type": "text",
                "text": "相談の前に。。。基本的な情報について教えてください！"
            },
            {
                "type": "text",
                "text": "専攻はなんですか？\n例: 工学部建築学科, 工学研究科建築学専攻"
            }
        ]

        this.grade = {
            "type": "text",
            "text": "学年はなんですか？"
        }

        this.finish = {
            "type": "template",
            "altText": "this is a confirm template",
            "template": {
                "type": "buttons",
                "actions": [
                    {
                        "type":"uri",
                        "label":"LINE@はこちら！",
                        "uri":"line://ti/p/@xmm7349x"
                    }
                ],
                "text": `ご予約ありがとうございます！ キャンセル、時間の調整や当日の連絡はLINE＠で連絡するので！LINE＠の登録を以下からお願いします！！`
            }
        }

        this.field = [
            {
                "type": "text",
                "text": "現時点で気になっている業界を一つ選んでください！"
            },
            {
            "type": "template",
            "altText": "this is a carousel template",
            "template": {
                "type": "carousel",
                "columns": [
                    {
                      "thumbnailImageUrl": "https://www.k-club.co.jp/clubism/online/wp/wp-content/uploads/2018/08/%E5%A4%A7%E9%98%AA%E6%9C%89%E6%A9%9F%E5%8C%96%E5%AD%A6%E5%B7%A5%E6%A5%AD-4-1000x667.jpg",
                      "imageBackgroundColor": "#FFFFFF",
                      "title": "化学・素材",
                      "text": "東レ、富士フィルム、三菱化学　など",
                      "actions": [
                          {
                              "type": "message",
                              "label": "化学",
                              "text": "化学"
                          }
                      ]
                    },
                    {
                        "thumbnailImageUrl": "https://joboole-production.s3.amazonaws.com/images/uploads/article_part_image/3291/image/img_60728b64-362a-4288-a287-a5b797cc2dc1.jpg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "食品メーカー",
                        "text": "サントリー、ロッテ、日清食品　など",
                        "actions": [
                            {
                                "type": "message",
                                "label": "食品",
                                "text": "食品"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://www.sanpou-s.net/find_job/industry/manufacture/images/img01.jpg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "電機・電子",
                        "text": "ソニー、パナソニック、三菱電機　など",
                        "actions": [
                            {
                                "type": "message",
                                "label": "電機メーカー",
                                "text": "電機メーカー"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://static.job-q.me/articleThumbnails/644_thumbnail.jpeg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "総合商社",
                        "text": "伊藤忠商事、三菱商事、住友商事　など",
                        "actions": [
                            {
                                "type": "message",
                                "label": "総合商社",
                                "text": "総合商社"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://static.job-q.me/articleThumbnails/314_thumbnail.jpeg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "ソフトウェア・システム開発",
                        "text": "NTT、ソフトバンク、KDDI　など",
                        "actions": [
                            {
                                "type": "message",
                                "label": "ソフトウェア",
                                "text": "ソフトウェア"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://ichoose.jp/img.php?id=879",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "インターネットサービス",
                        "text": "楽天、Yahoo、リクルート　など",
                        "actions": [
                            {
                                "type": "message",
                                "label": "インターネットサービス",
                                "text": "インターネットサービス"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://syukatsu-pro.com/wp-content/uploads/2016/10/shutterstock_356115095-640x320.jpg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "建設・住宅・不動産",
                        "text": "積水ハウス、大林組、大和ハウス工業　など",
                        "actions": [
                            {
                                "type": "message",
                                "label": "建設",
                                "text": "建設"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://cdn-ak.f.st-hatena.com/images/fotolife/c/ccfa/20181014/20181014233427.png",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "重工",
                        "text": "三菱重工・IHI・川崎重工",
                        "actions": [
                            {
                                "type": "message",
                                "label": "重工",
                                "text": "重工"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://campus.doda.jp/career/assets/20180827171523/images/pic-main_001.jpg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "その他",
                        "text": "金融、マスコミ、官公庁　など",
                        "actions": [
                            {
                                "type": "message",
                                "label": "その他",
                                "text": "その他"
                            }
                        ]
                      }
                ] 
            }
        }]
    }
    
}