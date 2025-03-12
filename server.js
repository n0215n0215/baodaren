const line = require('@line/bot-sdk');
const express = require('express');
const request = require('request');
const lineConfig = {
    channelAccessToken: process.env.HEROKU_LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.HEROKU_LINE_CHANNEL_SECRET
};
const client = new line.Client(lineConfig);
const app = express();
//const url = 'https://minkch.com/search/%E5%B7%A8/page/'
const url = 'https://minkch.com/archives/category/%E3%82%A8%E3%83%AD%E8%87%AA%E6%92%AE%E3%82%8A/page/'
const cheerio = require('cheerio');
const pimgurl = "https://i.imgur.com/ppfbJfn.jpeg";
var imgur = require('imgur');


app.listen(process.env.PORT || 3000, function() {
    //console.log('App now running on port', this.address().port);
});

app.post('/', line.middleware(lineConfig), function(req, res) {
    Promise
        .all(req.body.events.map(handleEvent))
        //.then(function(result) {
        //    res.json(result);
        //});
});

app.get('/web', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head><title>Line Messenger Bot</title></head><body><h1>Running-2022/5/2</body></html>');
    res.end();
});

function handleEvent(event) {
    switch (event.type) {
        case 'join':
            break
        case 'follow':
            //return client.replyMessage(event.replyToken, {
            //    type: 'text',
            //    text: '你好請問我們認識嗎?'
            //});
            break
        case 'message':
            switch (event.message.type) {
                case 'text':
                    switch (true) {
                        case (event.message.text.indexOf("抽") >= 0):
                            //replyMessage("還沒好啦！不要一直抽抽抽。", replyType.text, event);
                            var Randurl = url + getRandomIntInclusive(1, 277);
                            request(Randurl, (err, res, body) => {
                                const $ = cheerio.load(body);
                                let posts = [];
                                $('.entry-title a').each(function(i, elem) {
                                    posts.push($(this).attr("href"))
                                })
                                Randurl = posts[getRandomIntInclusive(0, posts.length - 1)];
                                //                                console.log(Randurl);
                                request(Randurl, (err, res, body) => {
                                    const $ = cheerio.load(body);
                                    let img = [];
                                    $('.pict').each(function(i, elem) {
                                        img.push($(this).attr("src"))
                                    })
                                    var rplink = img[getRandomIntInclusive(0, img.length - 1)]
                                        //console.log(rplink);
                                    pushMessage("https:" + rplink, replyType.image, event);
                                })
                            })
                            break;
                            //case (event.message.text.indexOf("恕我攔轎") >= 0):
                            //    replyMessage("漱漱漱", replyType.text, event);
                            //    //pushMessage("https://img.technews.tw/wp-content/uploads/2015/09/Google-logo_1.jpg", replyType.image, event);
                            //    break;
                        case (event.message.text.indexOf("幹") >= 0):
                            //replyMessage("幹什麼幹阿...？", replyType.text, event);
                            replySticker('7', replyType.sticker, event);
                            break;
                        case (event.message.text.indexOf("靠") >= 0):
                            replyMessage("北邊走一點", replyType.text, event);
                            break;
                        case (event.message.text.indexOf("**") >= 0):
                            pushMessage("https://v16-webapp.tiktok.com/9e00d68e4276516ddeae73a5f9413603/6270fc31/video/tos/alisg/tos-alisg-pve-0037/64cb5665bc3e442e9e3d8d02144c9392/?a=1988&br=3594&bt=1797&cd=0%7C0%7C1%7C0&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=JpusWhWH6BMFWU1jr0P3MNyO-pi&l=202205030355470102450622020F910F27&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=anllZHlpaG5tNTMzODgzM0ApZDNmNjg3NGVkNzs2NWQ6Omdub3NiZGJxMWhgLS1kLzRzczI2X2JjLzBiLWFjLjVhNS46Yw%3D%3D&vl=&vr=", replyType.video, event);
                            break;
                        case (event.message.text.indexOf("雷達") >= 0 || event.message.text.indexOf("迴波圖") >= 0 || event.message.text.indexOf("天氣") >= 0):
                            replyUri("雷達迴波圖", replyType.uri, event);
                            break;
                        case (event.message.text.indexOf("包大人") >= 0):
                            replyCarouselTemplateFormMinkch10(event)
                            break;
                        case (event.message.text.toUpperCase().indexOf("LUNC") >= 0):
                            pushflex(event);
                            break;
                        case (event.message.text.toUpperCase().indexOf("ETH") >= 0):
                            pushflexETH(event);
                            break;
                        default:
                            ////console.log(event);
                            //var rval = getRandomIntInclusive(1, 5)
                            //if (rval == 1) {
                            //    //replyMessage("default", replyType.text, event);
                            //    var url1 = "http://img.anyanother.com/tag/%E5%91%A8%E6%98%9F%E9%A6%B3/page/1/maxpage/999/minpage/"
                            //    var Randurl = url1 + getRandomIntInclusive(1, 42) + "/";
                            //    request(Randurl, (err, res, body) => {
                            //        const $ = cheerio.load(body);
                            //        let img1 = [];
                            //        $('img').each(function (i, elem) {
                            //            img1.push($(this).attr("src"))
                            //        })
                            //        var rplink1 = img1[getRandomIntInclusive(0, img1.length - 1)]
                            //        uploadImgur(rplink1,event);
                            //    });
                            //}  
                            break;
                    }
            }
            break;
        case "postback":
            var PostUser = "";
            //console.log(event.source.type);
            var UserInfo;
            if (event.source.type == "group") {
                UserInfo = client.getGroupMemberProfile(event.source.groupId, event.source.userId)
                UserInfo.then(function(value) {
                    //console.log(value.displayName);
                    PostUser = value.displayName;
                    replyMessage(PostUser + " 你的圖來了！", replyType.text, event);
                    Randurl = event.postback.data;
                    request(Randurl, (err, res, body) => {
                        const $ = cheerio.load(body);
                        $('.pict').each(function(i, elem) {
                            pushMessage($(this).attr("src"), replyType.image, event);
                        })
                    })
                })
            } else if (event.source.type == "room") {
                UserInfo = client.getRoomMemberProfile(event.source.roomId, event.source.userId)
                UserInfo.then(function(value) {
                    //console.log(value.displayName);
                    PostUser = value.displayName;
                    replyMessage(PostUser + " 你的圖來了！", replyType.text, event);
                    Randurl = event.postback.data;
                    request(Randurl, (err, res, body) => {
                        const $ = cheerio.load(body);
                        $('.pict').each(function(i, elem) {
                            pushMessage($(this).attr("src"), replyType.image, event);
                        })
                    })
                })
            } else {
                replyMessage(" 你的圖來了！", replyType.text, event);
                Randurl = event.postback.data;
                request(Randurl, (err, res, body) => {
                    const $ = cheerio.load(body);
                    $('.pict').each(function(i, elem) {
                        pushMessage($(this).attr("src"), replyType.image, event);
                    })
                })

            }
            //console.log(UserInfo);
            break
    }
}

function pushflex(event) {
    var source = event.source;
    const biuri = "https://api3.binance.com/api/v3/ticker/price?symbol=LUNCBUSD"
    const coinamount = 630752.0853;
    switch (source.type) {
        case "user":
            //return client.replyMessage
            //return client.pushMessage
            var lunaprice = "";
            var onecoinprice;
            request(biuri, (err, res, body) => {
                var tmpprice = JSON.parse(body)
                console.log(tmpprice)
                onecoinprice = tmpprice.price;
                lunaprice = coinamount * onecoinprice * 30;
                lunaprice = lunaprice.toFixed(2)
                return client.replyMessage(event.replyToken, {
                    type: "flex",
                    altText: "LUNC 發大財",
                    contents: {
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [{
                                    "type": "text",
                                    "text": "加密貨幣",
                                    "weight": "bold",
                                    "color": "#1DB446",
                                    "size": "sm"
                                },
                                {
                                    "type": "text",
                                    "text": "LUNC",
                                    "weight": "bold",
                                    "size": "50px",
                                    "margin": "md"
                                },
                                {
                                    "type": "text",
                                    "size": "18px",
                                    "color": "#aaaaaa",
                                    "wrap": true,
                                    "text": "幣值: $NT - 估計值"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xxl"
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [{
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "持有數量",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": coinamount.toString(),
                                                    "size": "20px",
                                                    "color": "#111111",
                                                    "align": "end"
                                                }
                                            ],
                                            "margin": "20px"
                                        },
                                        {
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "現價",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "$" + onecoinprice.toString(),
                                                    "size": "20px",
                                                    "color": "#111111",
                                                    "align": "end"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "總價值",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "$" + lunaprice.toString(),
                                                    "size": "25px",
                                                    "color": "#00bb00",
                                                    "align": "end",
                                                    "weight": "bold"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        "styles": {
                            "footer": {
                                "separator": true
                            }
                        }
                    }
                });
            })
            break
        case "room":
            var lunaprice = "";
            var onecoinprice;
            request(biuri, (err, res, body) => {
                var tmpprice = JSON.parse(body)
                console.log(tmpprice)
                onecoinprice = tmpprice.price;
                lunaprice = coinamount * onecoinprice * 30;
                lunaprice = lunaprice.toFixed(2)
                return client.replyMessage(event.replyToken, {
                    type: "flex",
                    altText: "LUNC 發大財",
                    contents: {
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [{
                                    "type": "text",
                                    "text": "加密貨幣",
                                    "weight": "bold",
                                    "color": "#1DB446",
                                    "size": "sm"
                                },
                                {
                                    "type": "text",
                                    "text": "LUNC",
                                    "weight": "bold",
                                    "size": "50px",
                                    "margin": "md"
                                },
                                {
                                    "type": "text",
                                    "size": "18px",
                                    "color": "#aaaaaa",
                                    "wrap": true,
                                    "text": "幣值: $NT - 估計值"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xxl"
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [{
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "持有數量",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": coinamount.toString(),
                                                    "size": "20px",
                                                    "color": "#111111",
                                                    "align": "end"
                                                }
                                            ],
                                            "margin": "20px"
                                        },
                                        {
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "現價",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "$" + onecoinprice.toString(),
                                                    "size": "20px",
                                                    "color": "#111111",
                                                    "align": "end"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "總價值",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "$" + lunaprice.toString(),
                                                    "size": "25px",
                                                    "color": "#00bb00",
                                                    "align": "end",
                                                    "weight": "bold"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        "styles": {
                            "footer": {
                                "separator": true
                            }
                        }
                    }
                });
            })
            break
        case "group":
            var lunaprice = "";
            var onecoinprice;
            request(biuri, (err, res, body) => {
                var tmpprice = JSON.parse(body)
                console.log(tmpprice)
                onecoinprice = tmpprice.price;
                lunaprice = coinamount * onecoinprice * 30;
                lunaprice = lunaprice.toFixed(2)
                return client.replyMessage(event.replyToken, {
                    type: "flex",
                    altText: "LUNC 發大財",
                    contents: {
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [{
                                    "type": "text",
                                    "text": "加密貨幣",
                                    "weight": "bold",
                                    "color": "#1DB446",
                                    "size": "sm"
                                },
                                {
                                    "type": "text",
                                    "text": "LUNC",
                                    "weight": "bold",
                                    "size": "50px",
                                    "margin": "md"
                                },
                                {
                                    "type": "text",
                                    "size": "18px",
                                    "color": "#aaaaaa",
                                    "wrap": true,
                                    "text": "幣值: $NT - 估計值"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xxl"
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [{
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "持有數量",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": coinamount.toString(),
                                                    "size": "20px",
                                                    "color": "#111111",
                                                    "align": "end"
                                                }
                                            ],
                                            "margin": "20px"
                                        },
                                        {
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "現價",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "$" + onecoinprice.toString(),
                                                    "size": "20px",
                                                    "color": "#111111",
                                                    "align": "end"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "horizontal",
                                            "contents": [{
                                                    "type": "text",
                                                    "text": "總價值",
                                                    "size": "20px",
                                                    "color": "#555555"
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "$" + lunaprice.toString(),
                                                    "size": "25px",
                                                    "color": "#00bb00",
                                                    "align": "end",
                                                    "weight": "bold"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        "styles": {
                            "footer": {
                                "separator": true
                            }
                        }
                    }
                });
            })
            break
    }
}

function pushflexETH(event) {
    var source = event.source;
    //const biuri = "https://api3.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
	const biuri = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    const coinamount = 1;
    var ethprice = "";
    var onecoinprice;
    var onecoinpricetoFixed2 = 0;
    request(biuri, (err, res, body) => {
        var tmpprice = JSON.parse(body)
        console.log(tmpprice)
        //onecoinprice = tmpprice.price;
		onecoinprice = tmpprice.ethereum.usd;
        ethprice = coinamount * onecoinprice * 30;
        onecoinpricetoFixed2 = onecoinprice * 1;
        onecoinpricetoFixed2 = onecoinpricetoFixed2.toFixed(2)
        ethprice = ethprice.toFixed(2)
        return client.replyMessage(event.replyToken, {
            type: "flex",
            altText: "ETH 發大財",
            contents: {
                "type": "bubble",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [{
                            "type": "text",
                            "text": "加密貨幣",
                            "weight": "bold",
                            "color": "#1DB446",
                            "size": "sm"
                        },
                        {
                            "type": "text",
                            "text": "ETH",
                            "weight": "bold",
                            "size": "50px",
                            "margin": "md"
                        },
                        {
                            "type": "text",
                            "size": "18px",
                            "color": "#aaaaaa",
                            "wrap": true,
                            "text": "資料來源: Binance 幣安"
                        },
                        {
                            "type": "separator",
                            "margin": "xxl"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "sm",
                            "contents": [{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [{
                                            "type": "text",
                                            "text": "持有數量",
                                            "size": "20px",
                                            "color": "#555555"
                                        },
                                        {
                                            "type": "text",
                                            "text": coinamount.toString(),
                                            "size": "20px",
                                            "color": "#111111",
                                            "align": "end"
                                        }
                                    ],
                                    "margin": "20px"
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [{
                                            "type": "text",
                                            "text": "現價(USD)",
                                            "size": "20px",
                                            "color": "#555555"
                                        },
                                        {
                                            "type": "text",
                                            "text": "$" + onecoinpricetoFixed2.toString(),
                                            "size": "20px",
                                            "color": "#111111",
                                            "align": "end"
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [{
                                            "type": "text",
                                            "text": "現價(TWD)",
                                            "size": "20px",
                                            "color": "#555555"
                                        },
                                        {
                                            "type": "text",
                                            "text": "$" + ethprice.toString(),
                                            "size": "20px",
                                            "color": "#00bb00",
                                            "align": "end",
                                            "weight": "bold"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "styles": {
                    "footer": {
                        "separator": true
                    }
                }
            }
        });
    })
}

function uploadImgur(url, event) {
    url = url.replace("thumb", "data");
    //console.log(url);
    imgur.uploadUrl(url)
        .then(function(json) {
            //console.log(json.data.link);
            pushMessage(json.data.link, replyType.image, event);
        })
        .catch(function(err) {
            console.error(err.message);
        });
}

function replyMessage(msg, type, event) {
    return client.replyMessage(event.replyToken, {
        type: type,
        text: msg
    });
}

function replySticker(msg, type, event) {
    return client.replyMessage(event.replyToken, {
        type: type,
        packageId: '1',
        stickerId: msg
    });
}

function replyUri(msg, type, event) {
    return client.replyMessage(event.replyToken, {
        type: 'template',
        altText: '雷達迴波圖來了！',
        template: {
            type: 'buttons',
            text: '雷達迴波圖來了！',
            actions: [{
                type: 'uri',
                label: '【看雷達迴波圖】',
                uri: 'line://app/1562295023-xP4BLrKg'
            }]
        }
    });
}


function replyImagemap(msg, type, event) {
    return client.replyMessage(event.replyToken, {
        type: 'imagemap',
        baseUrl: 'https://www.fzhd8.com/mobile/image/our-goods04.png',
        altText: 'this is an imagemap',
        baseSize: { height: 1040, width: 1040 },
        actions: [{
            type: 'uri',
            linkUri: 'https://example.com/',
            area: { x: 0, y: 0, width: 520, height: 1040 }
        }, {
            type: 'message',
            text: 'hello',
            area: { x: 520, y: 0, width: 520, height: 1040 }
        }]
    });
}

function replyCarouselTemplateFormMinkch10(event) {
    var columns = [];
    var Randurl = url + getRandomIntInclusive(1, 277);
    request(Randurl, (err, res, body) => {
        const $ = cheerio.load(body);
        $('article').each(function(i, elem) {
            columns.push({
                thumbnailImageUrl: $(this).find('.entry-content').find('a').find('img').attr("src"),
                title: $(this).find(".entry-title-text").text().substring(0, 40),
                text: $(this).find("strong").text(),
                actions: [{
                        type: 'postback',
                        label: '大家看',
                        data: $(this).find('.entry-title a').attr("href")
                    },
                    {
                        type: 'uri',
                        label: '偷偷看',
                        uri: $(this).find('.entry-title a').attr("href")
                    }
                ]
            });
        })
        return client.replyMessage(event.replyToken, {
            type: 'template',
            altText: '有人攔轎啦！',
            template: {
                type: 'carousel',
                columns: columns
            }
        });
    });


}

function pushMessage(msg, type, event) {
    var source = event.source;
    //switch (type) {
    //    case "text":
    //        return client.pushMessage(source.userId, {
    //            type: type,
    //            text: 'push'
    //        });
    //        break;
    //    case "image":
    //        return client.pushMessage(source.userId, {
    //            type: type,
    //            previewImageUrl: msg,
    //            originalContentUrl : msg
    //        });
    //        break;
    //    case "video":
    //        return client.pushMessage(source.userId, {
    //            type: type,
    //            previewImageUrl: msg,
    //            originalContentUrl : msg
    //        });
    //        break;
    //}
    if (msg.indexOf("https:") < 0) msg = "https:" + msg;
    //console.log(msg);
    switch (source.type) {
        case "user":
            if (type == "video") {
                return client.pushMessage(source.userId, {
                    type: type,
                    previewImageUrl: pimgurl,
                    originalContentUrl: msg
                });
            } else {
                return client.pushMessage(source.userId, {
                    type: type,
                    previewImageUrl: msg,
                    originalContentUrl: msg
                });
            }
            break
        case "room":
            if (type == "video") {
                return client.pushMessage(source.roomId, {
                    type: type,
                    previewImageUrl: pimgurl,
                    originalContentUrl: msg
                });
            } else {
                return client.pushMessage(source.roomId, {
                    type: type,
                    previewImageUrl: msg,
                    originalContentUrl: msg
                });
            }
            break
        case "group":
            if (type == "video") {
                return client.pushMessage(source.groupId, {
                    type: type,
                    previewImageUrl: pimgurl,
                    originalContentUrl: msg
                });
            } else {
                return client.pushMessage(source.groupId, {
                    type: type,
                    previewImageUrl: msg,
                    originalContentUrl: msg
                });
            }
            break
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

var replyType = {
    text: 'text',
    image: 'image',
    video: 'video',
    sticker: 'sticker',
    uri: 'uri'
};
