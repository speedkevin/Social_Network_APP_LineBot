var linebot = require('linebot');
var express = require('express');
var line = require('@line/bot-sdk');
// Config
var config = require('./config');
// Link to DB
var mongoose = require('mongoose');
mongoose.connect(config.getDbUrl(), { useMongoClient: true });
var db = mongoose.connection;
var User = require('./models/user');
// Async
var async = require('async');
// API
var Message = require('./api/message');
var eva = require('./api/evaluation');

var bot = linebot({
  channelId: config.getChannelId(),
  channelSecret: config.getChannelSecret(),
  channelAccessToken: config.getChannelAccessToken()
});

var currentdate = new Date();
var datetime = currentdate.getFullYear() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getDate() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
console.log(datetime);

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
  // if message is 開始設定
  if (event.message.type == 'text' && event.message.text == '編輯檔案') {
      var user_id = event.source.userId;
      User.findOne({ line_userid: user_id }, function(err, user) {
        if (!user) {
          console.log("user not found");
          console.log(user);
          var currentdate = new Date();
          var datetime = currentdate.getFullYear() + "/"
                          + (currentdate.getMonth()+1)  + "/"
                          + currentdate.getDate() + " @ "
                          + currentdate.getHours() + ":"
                          + currentdate.getMinutes() + ":"
                          + currentdate.getSeconds();
          console.log("編輯檔案時間：");
          console.log(datetime);
          //callback(err, user);
          var newUser = new User({
            line_userid: user_id,
            account_status: "open",
            role: "free",
            paid: false,
            paid_price: "0",
            paid_date: "",
            create_date: datetime
          });
          newUser.save(function(err) {});
          Message.initMessage(event, "設定四個步驟", "填寫完後，送『查看檔案』確認。");
        } else {
          // User already exists, push to LINE directly
          console.log("user found");
          console.log(user);
          Message.initMessage(event, "設定四個步驟", "填寫完後，送『查看檔案』確認。");
        }
      });
  } // end
  if (event.message.type == 'text' && event.message.text == '查看檔案') {
    User.find({"line_userid": event.source.userId }, function(err, user) {
      if(user.length === 0) {
        Message.pushTextMessage(event.source.userId, "您還沒有編輯個人檔案。請發送『編輯檔案』填寫個人資訊。");
      } else {
        Message.checkMessage(event, "查看檔案", "確認檔案資訊是否完整。");
      }
    });
  }// end if
  if (event.message.type == 'text' && event.message.text == '個人設定') {
    User.find({"line_userid": event.source.userId }, function(err, user) {
      if(user.length === 0) {
        Message.pushTextMessage(event.source.userId, "您還沒有編輯個人檔案。請發送『編輯檔案』填寫個人資訊。");
      } else {
        Message.editSettings(event, "查看設定", "請設定您的需求。");
      }
    });
  }

});

function isInMatchList(user, theOneId){
  var result = false;
  user.both_match_list.forEach(function(value, index, array) {
    if(value.theone_user_id === theOneId){
      result = true;
    }
  });
  return result;
}

function isInRejectList(user, theOneId){
  var result = false;
  user.both_reject_list.forEach(function(value, index, array) {
    if(value.theone_user_id === theOneId){
      result = true;
    }
  });
  return result;
}

bot.on('postback', function(event) {
  // self ID: event.source.userId
  // Other side ID: event.postback.data includes this ID
  console.log(event);

  var data = event.postback.data.split("&");
  var response = data[0];
  var userId = event.source.userId;
  var theOneId = data[1];

  /*
  if(response === 'paid') {
    if(otherside paid){
      // Get userId's / theOneId's contact
      // Push contacts
      Message.pushContact(userId, "對方已經付款。對方資訊：userId Contact", theOneId);
      // Message.pushContact(theOneId, "對方已經付款。對方資訊：theOneId Contact", userId);
      // Save paid into DB
    } else {
      // Paying processing...
      // Get userId's / theOneId's contact
      // Push contacts
      Message.pushContact(userId, "userId Contact", theOneId);
      Message.pushContact(theOneId, "theOneId Contact", userId);
      // Save paid into DB
    }
  }
  else if (response === 'rating') {}
  else if (response === 'comment') {}
  else if (response === 'block') {}
  else
  */
  if (response === 'yes' || response === 'no'){
    console.log("====== yes or no ======");

    var userDoc = {};
    var theOneDoc = {};

    // user[0]: user, user[1]: theone
    User.find({ $or: [{line_userid: userId}, {line_userid: theOneId}] }, function(err, user) {
      console.log("===== find user ====");
      console.log(user);
      // if converse, SWAP
      if(user[0].line_userid !== userId) {
        var temp = user[0];
        user[0] = user[1];
        user[1] = temp;
      }

      // if user and theone are in both_match_list or both_reject_list,
      if(isInMatchList(user[0], theOneId)) {
        // Push message say that both are accept/reject
        Message.pushLineMessage(userId, "雙方已經媒合成功囉，沒有必要再按『接受』或『拒絕』了。", theOneId); // and time
      }
      else if(isInRejectList(user[0], theOneId)) {
        // Push message say that both are accept/reject
        Message.pushLineMessage(userId, "兩人都按『拒絕』對方了，系統認定你們沒有緣了，但未來系統還會推薦更多人選的。", theOneId); // and time
      }
      else {

          userDoc = [user[0]];
          userRecomList = user[0].recomToMe_list;
          theOneDoc = [user[1]];
          theOneRecomList = user[1].recomToMe_list;

          console.log("===== userDoc ====");
          console.log(userDoc);
          console.log("===== userRecomList ====");
          console.log(userRecomList);
          console.log("===== theOneDoc ====");
          console.log(theOneDoc);
          console.log("===== theOneRecomList ====");
          console.log(theOneRecomList);

          // Update response to user[0]
          //user[0].recomToMe_list[0].response = response;
          //console.log("===== user[0] ====");
          //console.log(user[0]);

          //theOneIdArray = [user[1]];
          //console.log("===== theOneIdArray ====");
          //console.log(theOneIdArray);

          // Find B in A's list
          userRecomList.forEach(function(value, index, array) {
            console.log("===== user[0].recomToMe_list ====");
            console.log(value);

            // Find user's theone in recom list = user[1] ID
            if(value.theone_user_id === user[1].line_userid) {
              // Get past response from DB
              var userPastResponse = value.response;
              // Get numOfChanges from DB
              // The maximun number of changes can not greater than 2
              // The first change is because from status yet to yes, or yet to no,
              // the second change could be from yes to no, or no to yes,
              // which means that user should change their mind only one time

              // initial numOfChanges & response
              if(value.response === undefined){
                console.log("===== numOfChanges is undefined ====");
                value.response = response;
              }
              if(value.numOfChanges === undefined){
                console.log("===== numOfChanges is undefined ====");
                value.numOfChanges = 0;
              }

              // Update response
              userRecomList[index].response = response;

              var change_count = value.numOfChanges;
              // If the response is the same with the past response
              if(response === userPastResponse) {
                // Reply you've clicked already
                console.log("===== you've clicked already ====");
                if(response === 'yes'){
                  Message.pushLineMessage(userId, "提醒您，您重複點擊『接受』了。", theOneId);
                }
                else if(response === 'no'){
                  Message.pushLineMessage(userId, "提醒您，您重複點擊『拒絕』了。", theOneId);
                }
              }
              // If the response is different the past response, like yet to yes, like yet to no,
              // Or like user change his/her mind, like yes to no, no to yes
              else if(change_count < 2) {
                console.log("===== you've clicked less than twice ====");

                // Update changes, The number of changes + 1
                change_count++;
                userRecomList[index].numOfChanges = change_count;
                user[0].recomToMe_list = userRecomList;

                // Evaluation
                var evaluationResultList = [];
                evaluationResultList = eva.evaluation(user[0], theOneDoc);
                console.log("=== evaluationResultList ===");
                console.log(evaluationResultList);

                // Push message, depends on evaluationResultList
                var mydoc = evaluationResultList[0];
                // if match each other
                if(mydoc.userResp === 'yes' && mydoc.theOneResp === 'yes'){
                  console.log("===== 恭喜 ====");
                  Message.pushMatchMessage(user[1].contact, mydoc.userId, mydoc.userMsg, mydoc.theOneId); // and time
                  Message.pushMatchMessage(user[0].contact, mydoc.theOneId, mydoc.theOneMsg, mydoc.userId); // and time
                  user[0].both_match_list.push({theone_user_id: mydoc.theOneId});
                  user[1].both_match_list.push({theone_user_id: mydoc.userId});
                }
                else if(mydoc.userResp === 'no' && mydoc.theOneResp === 'no'){
                  console.log("===== nonono ====");
                  Message.pushLineMessage(mydoc.userId, mydoc.userMsg, mydoc.theOneId); // and time
                  Message.pushLineMessage(mydoc.theOneId, mydoc.theOneMsg, mydoc.userId); // and time
                  user[0].both_reject_list.push({theone_user_id: mydoc.theOneId});
                  user[1].both_reject_list.push({theone_user_id: mydoc.userId});
                }
                // otherwise
                else {
                  if(mydoc.pushUser === 1) {
                    console.log("===== Push to user ====");
                    Message.pushLineMessage(mydoc.userId, mydoc.userMsg, mydoc.theOneId); // and time
                  }
                  if (mydoc.pushTheOne === 1) {
                    console.log("===== Push to theone ====");
                    Message.pushLineMessage(mydoc.theOneId, mydoc.theOneMsg, mydoc.userId); // and time
                  }
                }

                // Update response of A
                // user.markModified('recomToMe_list');
                /*
                if(user[0].recomToMe_list[index].response === undefined){
                  console.log("===== response is undefined ====");
                  user[0].recomToMe_list[index].response = response;
                }
                */
                // Update numbers of changes
                //user[0].recomToMe_list[index].numOfChanges = change_count;

                // Save/Update to Database
                // 1. Update response of A
                // 2. Update numbers of changes
                // 3. Save log: from evaluationResultList + time
                // which neams: A's recomToMe_list will add 1,2,3, and A will be added to 4/5/6's recomToMe_list

                // Save user's response & changes in user's recomList
                user[0].save(function (err) {
                  if (err) console.log('User save unsuccessful.');
                });
                user[1].save(function (err) {
                  if (err) console.log('User save unsuccessful.');
                });

              } else {
                // Reply you can not change your mind
                console.log("===== you've clicked already ====");
                Message.pushLineMessage(userId, "提醒您，您已經重複點擊過『接受』和『拒絕』了。", theOneId); // and time
              }
            }
          });
      }// end else
    }); // end find DB
  } // end if yes/no
}); // end bot postback

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || config.getServerPort(), function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
