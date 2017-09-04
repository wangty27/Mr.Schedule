//index.js
//获取应用实例

/*
  Course Fomat
  {
    Order: 1,
    Name: "BU111",
    Instructor: "Dave Thompskin",
    Time:[
      {Day: ["M", "W", "F"], Start: 690, End: 770},
      {Day: ["T", "Th"], Start: 600, End: 680},
    ],
    Location: "HH1001",
    Other: ["LAB", "HH1002", {Day: ["M"], Start: 930, End: 980}]
  }
*/

var app = getApp()
var common = require("../../common.js")

var date = new Date()
var ALCourseList = wx.getStorageSync("COURSELIST")
var CurrentDate
var CurrentDayIndex
var MCourseList = []
var TCourseList = []
var WCourseList = []
var ThCourseList = []
var FCourseList = []

var CurrentDayList = []

Page({
  data: {
    userInfo: {
      nickName: 'Guest'
    },
    WeekDay: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    backgroundColor: ["#FFE37D", "#C8F7C5", "#99FFFF", "#FFEFD5", "##F0FFF0", "#E6E6FA", "#7FFFD4", "#FFC0CB", "#FFDDFF", "#EBEDB3", "#FFF5EE", "#FFF0F5", "#FF9D9D", "#CEFF9D", "#DBFFFF"],
    timeInterval: [],
    courseInterval: [],
    courseList: [],
    posList: [],
    AddNoticeHidden: false
  },

  onLoad: function (){
    let _this = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      wx.setStorageSync("USERINFO", userInfo)
      _this.setData({
        userInfo:userInfo
      })
    })
    CurrentDayIndex = date.getDay()
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var min = date.getMinutes();
    CurrentDate = {Year: year, Month: month, Day: day, String: common.DateString(year, month, day)}
    this.setData({
      CurrentDate: CurrentDate.String,
      CurrentDayIndex: CurrentDayIndex
    })
    for (var i = 0; i < 16; i++) {
      var Number = 420 + i * 60
      var String = common.TimeString(Number)
      this.data.timeInterval.push({ Number: Number, String: String })
      this.setData({
        timeInterval: this.data.timeInterval,
      })
    }
    this.updateCourseList()
  },

  updateCourseList: function () {
    ALCourseList = wx.getStorageSync("COURSELIST")
    var courseList = ALCourseList
    var courseListLength = courseList.length
    MCourseList = common.weekDayCourse(courseList, "M")
    TCourseList = common.weekDayCourse(courseList, "T")
    WCourseList = common.weekDayCourse(courseList, "W")
    ThCourseList = common.weekDayCourse(courseList, "Th")
    FCourseList = common.weekDayCourse(courseList, "F")

    /* CourseList */
    switch (CurrentDayIndex) {
      case 1: CurrentDayList = common.currentDayCourse(MCourseList, "M"); break;
      case 2: CurrentDayList = common.currentDayCourse(TCourseList, "T"); break;
      case 3: CurrentDayList = common.currentDayCourse(WCourseList, "W"); break;
      case 4: CurrentDayList = common.currentDayCourse(ThCourseList, "Th"); break;
      case 5: CurrentDayList = common.currentDayCourse(FCourseList, "F"); break;
      default: CurrentDayList = []; break;
    }

    /* Display */

    var CurrentHeightList = common.returnHeightList(CurrentDayList)
    var CurrentMarginList = common.returnMarginList(CurrentDayList)
    this.setData({
      courseList: CurrentDayList,
      heightList: CurrentHeightList,
      marginList: CurrentMarginList
    })
  },

  onShow: function(){
    if (common.needUpdateList) {
      this.updateCourseList()
      common.needUpdateList = false
    }
    var ALlen = ALCourseList.length
    if (ALlen == 0){
      this.setData({
        AddNoticeHidden: false,
      })
    } else if (ALlen > 0){
      this.setData({
        AddNoticeHidden: true,
      })
    }
  },
  
  onShareAppMessage: function () {
    return {
      title: "有了Mr.课表，上课不迟到！",
      path: "/pages/index/index",
      imageUrl: "../../resources/SharePic.png"
    }
  },

  ToAddClick: function(){
    wx.navigateTo({
      url: '../addCourse/addCourse',
    })
  },

  ToEditFunction: function(e){
    var Index = Number(e.currentTarget.dataset.id)
    var Order = CurrentDayList[Index].Course.Order
    wx.navigateTo({
      url: '../editCourse/editCourse?CourseOrder=' + Order,
    })
  },

  ToBtnClick: function(e){
    var dir = e.currentTarget.dataset.id
    if (dir == "L"){
      CurrentDayIndex--
      if (CurrentDayIndex < 0){
        CurrentDayIndex = 6
      }
    } else if (dir == "R"){
      CurrentDayIndex++
      if (CurrentDayIndex > 6){
        CurrentDayIndex = 0
      }
    }
    CurrentDate = common.changeDate(CurrentDate, dir)
    this.setData({
      CurrentDate: CurrentDate.String,
      CurrentDayIndex: CurrentDayIndex
    })
    this.updateCourseList()
  },

})
