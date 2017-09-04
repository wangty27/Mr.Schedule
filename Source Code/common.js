/*
  Course Fomat
  {
    Order: 1,
    Name: "Intro to Business",
    Number: "BU111",
    Instructor: "Dave Thompskin",
    Time:[
      {Day: ["M", "W", "F"], Start: 690, End: 780, String: "11:30 - 12:50 MWF"},
      {Day: ["T", "Th"], Start: 600, End: 680, String: "10:00 - 11:20 TTh"},
    ],
    Location: "HH1001",
    Other: ["LAB", "HH1002", {Day: ["M"], Start: 930, End: 980, String: "15:30 - 16:20 M"}]
  }
*/
function TimeString(Num){
  var hourNum = (parseInt(Num / 60))
  var minNum = Num % 60
  if (minNum < 10){
    var min = "0" + minNum.toString()
  } else{
    var min =  minNum.toString()
  }
  if (hourNum < 10){
    var hour = "0" + hourNum.toString()
  } else{
    var hour = hourNum.toString()
  }
  var relval = hour + ":" + min
  return relval
}

function StringGenerate(Day, Start, End){
  var len = Day.length
  var day = ""
  for (var i = 0; i < len; i++){
    if (Day[i] == "M"){
      day = day + "一"
    } else if (Day[i] == "T"){
      day = day + "二"
    } else if (Day[i] == "W"){
      day = day + "三"
    } else if (Day[i] == "Th"){
      day = day + "四"
    } else if (Day[i] == "F"){
      day = day + "五"
    }
  }
  
  var String = Start + " - " + End + "  " + day
  return String
}

function addCourse(passVal){
  var COURSELIST = wx.getStorageSync("COURSELIST")
  var length = COURSELIST.length
  if (passVal.passOtherExist){
    var Course = {
      Order: length + 1,
      Name: passVal.passName,
      Number: passVal.passNumber,
      Instructor: passVal.passInstructor,
      Time: passVal.passTime,
      Location: passVal.passLocation,
      Other: passVal.passOther,
      OtherExist: passVal.passOtherExist
    }
  } else{
    var Course = {
      Order: length + 1,
      Name: passVal.passName,
      Number: passVal.passNumber,
      Instructor: passVal.passInstructor,
      Time: passVal.passTime,
      Location: passVal.passLocation,
      Other: [],
      OtherExist: passVal.passOtherExist
    }
  }
  
  var updateList = []
  if (length == 0){
    updateList.push(Course)
  } else {
    for (var i = 0; i < length; i++){
      updateList.push(COURSELIST[i])
    }
    updateList.push(Course)
  }
  wx.setStorageSync("COURSELIST", updateList)
}

function returnCourse(passVal){
  if (passVal.passOtherExist) {
    var Course = {
      Order: passVal.passOrder,
      Name: passVal.passName,
      Number: passVal.passNumber,
      Instructor: passVal.passInstructor,
      Time: passVal.passTime,
      Location: passVal.passLocation,
      Other: passVal.passOther,
      OtherExist: passVal.passOtherExist
    }
  } else {
    var Course = {
      Order: passVal.passOrder,
      Name: passVal.passName,
      Number: passVal.passNumber,
      Instructor: passVal.passInstructor,
      Time: passVal.passTime,
      Location: passVal.passLocation,
      Other: [],
      OtherExist: passVal.passOtherExist
    }
  }
  return Course
}

function weekDayCourse(CourseList, CurrentDay){
  var len = CourseList.length
  var relList = []
  for (var i = 0; i < len; i++){
    var jlen = CourseList[i].Time.length
    var pushed = false
    for (var j = 0; j < jlen; j++){
      var klen = CourseList[i].Time[j].Day.length
      for (var k = 0; k < klen; k++) {
        if (CourseList[i].Time[j].Day[k]){
          relList.push(CourseList[i])
          pushed = true
        }
      }
    }
    if (!pushed && CourseList[i].Other.length > 0){
      var olen = CourseList[i].Other[2].Day.length
      for (var o = 0; o < olen; o++){
        if (CourseList[i].Other[2].Day[o] == CurrentDay){
          relList.push(CourseList[i])
        }
      }
    }
  }
  return relList;
}

function currentDayCourse(CourseList, CurrentDay){
  var len = CourseList.length
  var relList = []
  for (var i = 0; i < len; i++){
    var jlen = CourseList[i].Time.length
    for (var j = 0; j < jlen; j++){
      var klen = CourseList[i].Time[j].Day.length
      for (var k = 0; k < klen; k++){
        if (CourseList[i].Time[j].Day[k] == CurrentDay){
          var time = TimeString(CourseList[i].Time[j].Start) + " - " + TimeString(CourseList[i].Time[j].End)
          relList.push({Course: CourseList[i], Start: CourseList[i].Time[j].Start, End: CourseList[i].Time[j].End, Time: time})
        }
      }
    }
    if (CourseList[i].Other.length > 0){
      var olen = CourseList[i].Other[2].Day.length
      for (var o = 0; o < olen; o++){
        if (CourseList[i].Other[2].Day[o] == CurrentDay){
          var course = {
            Order: CourseList[i].Order,
            Number: CourseList[i].Number,
            Type: CourseList[i].Other[0],
            Instructor: "",
            Location: CourseList[i].Other[1]
          }
          var time = TimeString(CourseList[i].Other[2].Start) + " - " + TimeString(CourseList[i].Other[2].End)
          relList.push({ Course: course, Start: CourseList[i].Other[2].Start, End: CourseList[i].Other[2].End, Time: time})
        }
      }
    }
  }
  return relList
}

function returnHeightList(CourseList){
  var len = CourseList.length
  var relList = []
  for (var i = 0; i < len; i++){
    var pushContent = ((CourseList[i].End - CourseList[i].Start) * 2).toString() + "rpx"
    //console.log(pushContent)
    relList.push(pushContent)
  }
  return relList
}

function returnMarginList(CourseList){
  var len = CourseList.length
  var relList = []
  for (var i = 0; i < len; i++){
    var pushContent = ((CourseList[i].Start - 420) * 2 - 1).toString() + "rpx"
    relList.push(pushContent)
  }
  return relList
}

function changeDate(CurrentDate, Dir){
  var year = CurrentDate.Year
  var month = CurrentDate.Month
  var day = CurrentDate.Day
  if (Dir == "L"){
    var tempday = day - 1
    if (tempday <= 0){
      var tempmonth = month - 1
      if (tempmonth <= 0){
        year--
        month = 12
        day = 31
      } else{
        month--
      }
      switch(month){
        case 1: day = 31; break;
        case 2: if ((year % 4) == 0){ day = 29 } else{ day = 28 }; break;
        case 3: day = 31; break;
        case 4: day = 30; break;
        case 5: day = 31; break;
        case 6: day = 30; break;
        case 7: day = 31; break;
        case 8: day = 31; break;
        case 9: day = 30; break;
        case 10: day = 31; break;
        case 11: day = 30; break;
        default: break;
      }
    } else{
      day--
    }
  } else if (Dir == "R") {
    var tempday = day + 1
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10){
      if (tempday > 31){
        month++
        day = 1
      } else{
        day++
      }
    } else if (month == 4 || month == 6 || month == 9 || month == 11){
      if (tempday > 30){
        month++
        day = 1
      } else{
        day++
      }
    } else if (month == 2){
      if ((year % 4) == 0 && tempday > 29){
        month++
        day = 1
      } else if ((year % 4) != 0 && tempday > 28){
        month++
        day = 1
      } else{
        day++
      }
    } else if (month == 12){
      if (tempday > 31){
        year++
        month = 1
        day = 1
      } else{
        day++
      }
    }
  }
  var relDate = {Year: year, Month: month, Day: day, String: DateString(year, month, day)}
  return relDate
}

function ETHOK(STH, ETH, len){
  if (len == 1){
    if (ETH <= STH){
      return false
    }
  } else{
    for (var i = 0; i < len; i++){
      if (ETH[i] <= STH[i]){
        return false
      }
    }
  }
  return true
}

function DateString(Year, Month, Day){
  return Year + "年" + Month + "月" + Day + "日"
}

var needUpdateList = false

module.exports = {
  addCourse: addCourse,
  StringGenerate: StringGenerate,
  TimeString: TimeString,
  returnCourse: returnCourse,
  weekDayCourse: weekDayCourse,
  currentDayCourse: currentDayCourse,
  returnHeightList: returnHeightList,
  returnMarginList: returnMarginList,
  ETHOK: ETHOK,
  DateString: DateString,
  changeDate: changeDate,
  needUpdateList: needUpdateList
}