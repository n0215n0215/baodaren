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
const url = 'https://minkch.com/archives/category/%E3%82%A8%E3%83%AD%E5%86%99%E3%83%A1%E3%83%BB%E8%87%AA%E6%92%AE%E3%82%8A/page/'
const cheerio = require('cheerio');


app.listen(process.env.PORT || 3000, function () {
    //console.log('App now running on port', this.address().port);
});

app.post('/', line.middleware(lineConfig), function (req, res) {
    Promise
    .all(req.body.events.map(handleEvent))
    .then(function (result) {
        res.json(result);
    });
});

app.get('/web', function (req, res) {
    //let arg = req.query.msg;
    arg = "ABC";
    //weeklyFacebookPost(arg);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head><title>Facebook Messenger Bot</title></head><body><h1>Running</body></html>');
//res.write(messengerButton);
res.end();
});

function handleEvent(event) {
    switch (event.type) {
        case 'join':
        case 'follow':
            //return client.replyMessage(event.replyToken, {
            //    type: 'text',
            //    text: '你好請問我們認識嗎?'
            //});
        case 'message':
            switch (event.message.type) {
                case 'text':
                    switch (event.message.text) {
                        case "抽":
                            //replyMessage("還沒好啦！不要一直抽抽抽。", replyType.text, event);
                            var Randurl = url + getRandomIntInclusive(1, 277);
                            request(Randurl, (err, res, body) => {
                                const $ = cheerio.load(body);
                                let posts = [];
                                $('.entry-title a').each(function (i, elem) {
                                    posts.push($(this).attr("href"))
                                })
                                Randurl = posts[getRandomIntInclusive(0, posts.length - 1)];
                                //                                console.log(Randurl);
                                request(Randurl, (err, res, body) => {
                                    const $ = cheerio.load(body);
                                    let img = [];
                                    $('.pict').each(function (i, elem) {
                                        img.push($(this).attr("src"))
                                    })
                                    var rplink = img[getRandomIntInclusive(0, img.length - 1)]
                                    //console.log(rplink);
                                    pushMessage("https:" + rplink, replyType.image, event);
                                })
                            })
                            break;
                        case "恕我攔轎":
                            replyMessage("漱漱漱", replyType.text, event);
                            //pushMessage("https://img.technews.tw/wp-content/uploads/2015/09/Google-logo_1.jpg", replyType.image, event);
                            break;
                        case "幹":
                            replyMessage("幹什麼幹阿...？", replyType.text, event);
                            //pushMessage("https://img.technews.tw/wp-content/uploads/2015/09/Google-logo_1.jpg", replyType.image, event);
                            break;
                        default:
                            //replyMessage(event.message.text, replyType.text, event);
                            break;
                    }
            }
    }
}

function replyMessage(msg, type, event) {
    return client.replyMessage(event.replyToken, {
        type: type,
        text: msg
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
    switch (source.type) {
        case "user":
                    return client.pushMessage(source.userId, {
                        type: type,
                        previewImageUrl: msg,
                        originalContentUrl : msg
                    });
            break
        case "room":
            return client.pushMessage(source.roomId, {
                type: type,
                previewImageUrl: msg,
                originalContentUrl : msg
            });

            break
        case "group":
            return client.pushMessage(source.groupId, {
                type: type,
                previewImageUrl: msg,
                originalContentUrl : msg
            });
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
    video: 'video'
};