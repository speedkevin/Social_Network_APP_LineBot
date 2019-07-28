var linebot = require('linebot');
var line = require('@line/bot-sdk');
// Config
var config = require('../config');

module.exports.pushTextMessage = function(user_id, msg) {
  console.log(user_id + ": " + msg);
  const client = new line.Client({
    channelAccessToken: config.getChannelAccessToken()
  });

  const message = {
    type: 'text',
    text: msg
  };

  client.pushMessage(user_id, message)
    .then(() => {

    })
    .catch((err) => {
      // error handling
    });
}

module.exports.initMessage = function(event, title, text) {
  console.log("initMessage");
  // Reply message
  const client = new line.Client({
    channelAccessToken: config.getChannelAccessToken()
  });

  // Routing has to be made
  // http://127.0.0.1:5002/common/U5979300808a6bbe3ddbdf72adfd9f96d
  const msg = {
    "type": "template",
    "altText": "this is a buttons template",
    "template": {
        "type": "buttons",
        "thumbnailImageUrl": config.getMaipoUrl(),
        "imageAspectRatio": "square",
        "title": title,
        "text": text,
        "actions": [
            {
              "type": "uri",
              "label": "1.填寫個人檔案",
              "uri": "https://" + config.getNsDomain() + "/users/criteria-self-line/" + event.source.userId
            },
            {
              "type": "uri",
              "label": "2.上傳個人圖片",
              "uri": "https://" + config.getPyDomain() + "/upload/self/" + event.source.userId
            },
            {
              "type": "uri",
              "label": "3.填寫理想對象檔案",
              "uri": "https://" + config.getNsDomain() + "/users/criteria-friend-line/" + event.source.userId
            },
            {
              "type": "uri",
              "label": "4.上傳理想對象圖片",
              "uri": "https://" + config.getPyDomain() + "/upload/theone/" + event.source.userId
            }
        ]
    }
  }

  // Push steps message to user
  client.replyMessage(event.replyToken, msg)
    .then(() => {
      // success
      console.log(msg);
    })
    .catch((err) => {
      // error handling
      console.log(err);
  });
}

module.exports.checkMessage = function(event, title, text) {

    const client = new line.Client({
      channelAccessToken: config.getChannelAccessToken()
    });

    const message = {
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
          "type": "buttons",
          "thumbnailImageUrl": "https://" + config.getPyDomain() + "/show/self/" + event.source.userId + ".jpeg",
          "imageAspectRatio": "square",
          "title": title,
          "text": text,
          "actions": [
              {
                "type": "uri",
                "label": "查看設定",
                "uri": "https://" + config.getNsDomain() + "/users/line-settings/" + event.source.userId
              }
          ]
      }
    };

    client.pushMessage(event.source.userId, message)
      .then(() => {
        // success
        console.log('success');
      })
      .catch((err) => {
        // error
        console.log('error:' + err);
    });
}

module.exports.editSettings = function(event, title, text) {

    const client = new line.Client({
      channelAccessToken: config.getChannelAccessToken()
    });

    const message = {
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
          "type": "buttons",
          "thumbnailImageUrl": "https://" + config.getPyDomain() + "/show/self/" + event.source.userId + ".jpeg",
          "imageAspectRatio": "square",
          "title": title,
          "text": text,
          "actions": [
              {
                "type": "uri",
                "label": "個人設定",
                "uri": "https://" + config.getNsDomain() + "/users/personal-settings/" + event.source.userId
              }
          ]
      }
    };

    client.pushMessage(event.source.userId, message)
      .then(() => {
        // success
        console.log('success');
      })
      .catch((err) => {
        // error
        console.log('error:' + err);
    });
}

module.exports.pushLineMessage = function(userId, msg, otherSideId) {
  const client = new line.Client({
    channelAccessToken: config.getChannelAccessToken()
  });
  const message = {
    "type": "template",
    "altText": msg,
    "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://" + config.getPyDomain() + "/show/self/" + otherSideId + ".jpeg",
        "imageAspectRatio": "square",
        "title": msg,
        "text": "請選擇接受/拒絕對方",
        "actions": [
            {
              "type": "postback",
              "label": "接受",
              "data": "yes&" + otherSideId // send data to linebot, including "accept" and "other side ID"
            },
            {
              "type": "postback",
              "label": "拒絕",
              "data": "no&" + otherSideId
            }
            /*,
            {
              "type": "uri",
              "label": "對方檔案",
              "uri": "https://" + config.getNsDomain() + "/users/check-profile/" + otherSideId
            }
            */
        ]
    }
  };

  client.pushMessage(userId, message)
    .then(() => {

    })
    .catch((err) => {
      // error handling
    });
}

module.exports.pushReplyMessage = function(userId, msg, otherSideId) {
  const client = new line.Client({
    channelAccessToken: config.getChannelAccessToken()
  });
  const message = {
    "type": "template",
    "altText": msg,
    "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://" + config.getPyDomain() + "/show/self/" + otherSideId + ".jpeg",
        "imageAspectRatio": "square",
        "title": msg,
        "text": "更多對方資訊，請點擊下方連結。",
        "actions": [
            {
              "type": "uri",
              "label": "對方檔案",
              "uri": "https://" + config.getNsDomain() + "/users/check-profile/" + otherSideId
            }
        ]
    }
  };

  client.pushMessage(userId, message)
    .then(() => {

    })
    .catch((err) => {
      // error handling
    });
}

module.exports.pushMatchMessage = function(contact, userId, msg, otherSideId) {
  const client = new line.Client({
    channelAccessToken: config.getChannelAccessToken()
  });
  const message = {
    "type": "template",
    "altText": msg,
    "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://" + config.getPyDomain() + "/show/self/" + otherSideId + ".jpeg",
        "imageAspectRatio": "square",
        "title": msg,
        "text": "媒合成功！點擊下列選項，您可以得到對方的聯絡資訊了！",
        "actions": [
          {
             "type":"message",
             "label":"LINE ID",
             "text": "對方的LINE ID是：" + contact.line
          },
          {
            "type": "uri",
            "label": "檢舉",
            "uri": "https://" + config.getNsDomain() + "/users/line-impeach/" + userId + "&&" + otherSideId
          }
        ]
    }
  };

  client.pushMessage(userId, message)
    .then(() => {

    })
    .catch((err) => {
      // error handling
    });
}
