function isNotInList(userId, list){
  console.log("*** list.length ***");
  console.log(list.length);
  var result;
  if(list.length === 0){
    console.log("*** list.String ***");
    result = true;
  } else {
    list.forEach(function(value, index, array) {
      console.log("*** userId ***");
      console.log(userId);
      console.log("*** value ***");
      console.log(value);
      console.log("*** value.theone_user_id ***");
      console.log(value.theone_user_id);
      if(userId === value.theone_user_id){
        console.log("*** aaaaaa ***");
        result = false;
      } else {
        if(index === array.length - 1){
          console.log("*** to the end ***");
          result = true;
        }
      }
    });
  }
  return result;
}

function isInListResponse(userId, list){
  console.log("*** list.length 2 ***");
  console.log(list.length);
  var result;
  if(list.length === 0){
    console.log("*** list.String 2 ***");
    result = false;
  } else {
    list.forEach(function(value, index, array) {
      console.log("*** userId 2 ***");
      console.log(userId);
      console.log("*** value 2 ***");
      console.log(value);
      console.log("*** value.theone_user_id 2 ***");
      console.log(value.theone_user_id);
      if(userId === value.theone_user_id){
        console.log("*** value.response 2 ***");
        console.log(value.response);
        // return value.response;
        result = value.response;
      } else {
        if(index === array.length - 1){
          console.log("*** to the end 2 ***");
          result = false;
        }
      }
    });
  }
  return result;
}

module.exports.evaluation = function(user, theOneSortingDoc) {
  var evaluationResult = [];
  theOneSortingDoc.forEach(function(theOneDoc, myindex, myarray) {
    var userId = user.line_userid;
    var usersList = user.recomToMe_list;
    var theOneId = theOneDoc.line_userid;
    var theOneList = theOneDoc.recomToMe_list;
    console.log("userId");
    console.log(userId);
    console.log("usersList");
    console.log(usersList);
    console.log("theOneId");
    console.log(theOneId);
    console.log("theOneList");
    console.log(theOneList);

    /*
    if(user.recomToMe_list.String === undefined){
      console.log("user.recomToMe_list.String undefined");
      user.recomToMe_list = [];
    };
    */

    console.log("== isNotInList ==");
    console.log(isNotInList(theOneId, usersList));
    console.log("== isNotInList end ==");

    console.log("== isInListResponse ==");
    console.log(isInListResponse(theOneId, usersList));
    console.log("== isInListResponse end ==");

    // if theOneUserID is not in user's recomToMe_list
    if(isNotInList(theOneId, usersList)){
      // if user.line_userid is not in theOneUser.recomToMe_list
      if(isNotInList(userId, theOneList)){
        console.log("1-1");
        evaluationResult.push({userId: userId, pushUser: 1, userMsg: '首次推薦，想要認識對方嗎？', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '首次推薦，想要認識對方嗎？', theOneResp: 'yet' });
        // save [1,1] into evaluationList
        // Push both A & B later
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is undefined
      else if(isInListResponse(userId, theOneList) === 'yet'){
        console.log("1-2");
        evaluationResult.push({userId: userId, pushUser: 1, userMsg: '首次推薦，想要認識對方嗎？', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '', theOneResp: 'yet' });
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is yes
      else if(isInListResponse(userId, theOneList) === 'yes'){
        console.log("1-3");
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '對方有想要認識您，想要認識對方嗎？', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '',  theOneResp: 'yes' });
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is no
      else if(isInListResponse(userId, theOneList) === 'no'){
        console.log("1-4");
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '有把您推薦過給對方，想要打破沉默，互相認識嗎？', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '',  theOneResp: 'no'});
      }
    }
    // if theOneUserID is in user's recomToMe_list, and user's recomToMe_list's response is undefined
    else if(isInListResponse(theOneId, usersList) === 'yet'){
      // if user.line_userid is not in theOneUser.recomToMe_list
      if(isNotInList(userId, theOneList)){
        evaluationResult.push({userId: userId, pushUser: 0,  userMsg: '', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '有把您推薦過給對方，但對方還未回應，想要主動認識對方嗎？',  theOneResp: 'yet' });
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is undefined
      else if(isInListResponse(userId, theOneList) === 'yet'){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '您和對方都還沒有回應，想要打破沉默，互相認識嗎？', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '您和對方都還沒有回應，想要打破沉默，互相認識嗎？' ,  theOneResp: 'yet'});
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is yes
      else if(isInListResponse(userId, theOneList) === 'yes'){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '對方按了『接受』，想要認識您，想要主動認識對方嗎？', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '等待對方回應，如果對方也接受，雙方就有機會更進一步認識。', theOneResp: 'yes'});
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is no
      else if(isInListResponse(userId, theOneList) === 'no'){
        evaluationResult.push({userId: userId, pushUser: 0,  userMsg: '', userResp: 'yet',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '', theOneResp: 'no'});
      }
    }
    // if theOneUserID is in user's recomToMe_list, and user's recomToMe_list's response is yes
    else if(isInListResponse(theOneId, usersList) === 'yes'){
      // if user.line_userid is not in theOneUser.recomToMe_list
      if(isNotInList(userId, theOneList)){
        console.log("3-1");
        evaluationResult.push({userId: userId, pushUser: 1, userMsg: '您按了『接受』，正在等待對方回應，如果對方也接受，雙方就有機會更進一步認識。', userResp: 'yes',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '對方想要認識您，想要主動認識對方嗎？', theOneResp: 'yet' });
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is undefined
      else if(isInListResponse(userId, theOneList) === 'yet'){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '您按了『接受』，正在等待對方回應，如果對方也接受，雙方就有機會更進一步認識。', userResp: 'yes',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '對方想要認識您，想要主動認識對方嗎？', theOneResp: 'yet'});
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is yes
      else if(isInListResponse(userId, theOneList) === 'yes'){
        evaluationResult.push({userId: userId, pushUser: 1, userMsg: '恭喜！雙方都想要彼此認識！', userResp: 'yes',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '恭喜！雙方都想要彼此認識！', theOneResp: 'yes'});
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is no
      else if(isInListResponse(userId, theOneList) === 'no'){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '您按了『接受』，正在等待對方回應，如果對方也接受，雙方就有機會更進一步認識。', userResp: 'yes',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '', theOneResp: 'no'});
      }
    }
    // if theOneUserID is in user's recomToMe_list, and user's recomToMe_list's response is no
    else if(isInListResponse(theOneId, usersList) === 'no'){
      // if user.line_userid is not in theOneUser.recomToMe_list
      if(isNotInList(userId, theOneList)){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '您按了『拒絕』。', userResp: 'no',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '', theOneResp: 'yet' });
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is undefined
      else if(isInListResponse(userId, theOneList) === 'yet'){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '您按了『拒絕』。', userResp: 'no',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '', theOneResp: 'yet' });
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is yes
      else if(isInListResponse(userId, theOneList) === 'yes'){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '您按了『拒絕』，但對方想要認識您喔！您要不要再三考慮一下，給對方一個機會呢？', userResp: 'no',
          theOneId: theOneId, pushTheOne: 1, theOneMsg: '對方按了『拒絕』，但或許對方會改變主意，系統會再通知您。', theOneResp: 'yes' });
      }
      // if user.line_userid is in theOneUser.recomToMe_list, and theOneUser's recomToMe_list's response is no
      else if(isInListResponse(userId, theOneList) === 'no'){
        evaluationResult.push({userId: userId, pushUser: 1,  userMsg: '您按了『拒絕』。', userResp: 'no',
          theOneId: theOneId, pushTheOne: 0, theOneMsg: '', theOneResp: 'no' });
      }
    }
  });
  console.log(evaluationResult);
  return evaluationResult;
}
