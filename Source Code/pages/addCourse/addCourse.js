// pages/addCourse/addCourse.js
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
var STH = [0, 0, 0, 0, 0]   //Start time in min
var ETH = [0, 0, 0, 0, 0]  //End time in min
var OSTH = 0    //Other Start time in min
var OETH = 0    //Other
var currentTimes = 0
var AddOther = false
var Info = {
  Name: "",
  Number: "",
  Instructor: "",
  Location: "",
  OtherType: "",
  OtherLocation: ""
}

var common = require("../../common.js")

Page({
  data: {
    delHiddenCtl: true,
    Adding: false,
    OtherTimeStart: "00:00",
    OtherTimeEnd: "00:00",
    OtherDayMSelected: false,
    OtherDayTSelected: false,
    OtherDayWSelected: false,
    OtherDayThSelected: false,
    OtherDayFSelected: false,
    timeList: [],
    timeStart: [],
    timeEnd: [],
    DayMSelected: [],
    DayTSelected: [],
    DayWSelected: [],
    DayThSelected: [],
    DayFSelected: [],
  },

  onLoad: function (options) {

  },

  onUnload: function () {
    STH = [0, 0, 0, 0, 0]   //Start time in min
    ETH = [0, 0, 0, 0, 0]   //End time in min
    OSTH = 0    //Other Start time in min
    OETH = 0    //Other End time in min
    currentTimes = 0
    AddOther = false
    Info = {
      Name: "",
      Number: "",
      Instructor: "",
      Location: "",
      OtherType: "",
      OtherLocation: ""
    }
  },

  InfoInput: function (e) {
    var id = e.target.id
    if (id == "NameInput") {
      Info.Name = e.detail.value
    } else if (id == "NumberInput") {
      Info.Number = e.detail.value
    } else if (id == "InstructorInput") {
      Info.Instructor = e.detail.value
    } else if (id == "LocationInput") {
      Info.Location = e.detail.value
    } else if (id == "OtherTypeInput") {
      Info.OtherType = e.detail.value
    } else if (id == "OtherLocationInput") {
      Info.OtherLocation = e.detail.value
    }
  },

  AddTime: function () {
    var length = this.data.timeList.length
    currentTimes = currentTimes + 1
    this.AddDelHidden()
    this.data.timeList.push(length)
    this.data.timeStart.push("00:00")
    this.data.timeEnd.push("00:00")
    this.data.DayMSelected.push(false)
    this.data.DayTSelected.push(false)
    this.data.DayWSelected.push(false)
    this.data.DayThSelected.push(false)
    this.data.DayFSelected.push(false)
    this.setData({
      timeList: this.data.timeList,
      timeStart: this.data.timeStart,
      timeEnd: this.data.timeEnd,
      DayMSelected: this.data.DayMSelected,
      DayTSelected: this.data.DayTSelected,
      DayWSelected: this.data.DayWSelected,
      DayThSelected: this.data.DayThSelected,
      DayFSelected: this.data.DayFSelected
    })
  },

  DelTime: function () {
    var length = this.data.timeList.length
    currentTimes = currentTimes - 1
    this.AddDelHidden()
    this.data.timeList.pop()
    this.data.timeStart.pop()
    this.data.timeEnd.pop()
    this.data.DayMSelected.pop()
    this.data.DayTSelected.pop()
    this.data.DayWSelected.pop()
    this.data.DayThSelected.pop()
    this.data.DayFSelected.pop()
    this.setData({
      timeList: this.data.timeList,
      timeStart: this.data.timeStart,
      timeEnd: this.data.timeEnd,
      DayMSelected: this.data.DayMSelected,
      DayTSelected: this.data.DayTSelected,
      DayWSelected: this.data.DayWSelected,
      DayThSelected: this.data.DayThSelected,
      DayFSelected: this.data.DayFSelected
    })
  },

  AddDelHidden: function (length) {
    if (currentTimes == 0) {
      this.setData({
        delHiddenCtl: true
      })
    } else if (currentTimes > 0 && currentTimes < 5) {
      this.setData({
        addHiddenCtl: false,
        delHiddenCtl: false,
      })
    } else if (currentTimes == 5) {
      this.setData({
        addHiddenCtl: true
      })
    }
  },

  StartTimeChange: function (e) {
    this.data.timeStart[e.target.id] = e.detail.value
    var time = e.detail.value
    var splited = time.split(":")
    STH[e.target.id] = Number(splited[0]) * 60 + Number(splited[1])
    this.setData({
      timeStart: this.data.timeStart
    })
  },

  EndTimeChange: function (e) {
    var time = e.detail.value
    var splited = time.split(":")
    ETH[e.target.id] = Number(splited[0]) * 60 + Number(splited[1])
    if (ETH[e.target.id] > STH[e.target.id]) {
      this.data.timeEnd[e.target.id] = e.detail.value
      this.setData({
        timeEnd: this.data.timeEnd
      })
    } else {
      wx.showModal({
        title: '错误',
        content: '结束时间必须在开始时间之后',
        showCancel: false,
      })
    }
  },

  DaySelect: function (e) {
    var id = e.target.id
    var subid = e.currentTarget.dataset.subid
    if (subid == "Day-M") {
      this.data.DayMSelected[id] = !this.data.DayMSelected[id]
      this.setData({
        DayMSelected: this.data.DayMSelected
      })
    } else if (subid == "Day-T") {
      this.data.DayTSelected[id] = !this.data.DayTSelected[id]
      this.setData({
        DayTSelected: this.data.DayTSelected
      })
    } else if (subid == "Day-W") {
      this.data.DayWSelected[id] = !this.data.DayWSelected[id]
      this.setData({
        DayWSelected: this.data.DayWSelected
      })
    } else if (subid == "Day-Th") {
      this.data.DayThSelected[id] = !this.data.DayThSelected[id]
      this.setData({
        DayThSelected: this.data.DayThSelected
      })
    } else if (subid == "Day-F") {
      this.data.DayFSelected[id] = !this.data.DayFSelected[id]
      this.setData({
        DayFSelected: this.data.DayFSelected
      })
    }
  },

  AddDelOther: function () {
    if (this.data.Adding == true) {
      this.setData({
        OtherTimeStart: "00:00",
        OtherTimeEnd: "00:00",
        OtherDayMSelected: false,
        OtherDayTSelected: false,
        OtherDayWSelected: false,
        OtherDayThSelected: false,
        OtherDayFSelected: false,
        OtherTypeInput: "",
        OtherLocationInput: ""
      })
    }
    AddOther = !AddOther
    this.setData({
      Adding: !this.data.Adding
    })
  },

  OtherTimeStartChange: function (e) {
    this.data.OtherTimeStart = e.detail.value
    var time = e.detail.value
    var splited = time.split(":")
    OSTH = Number(splited[0]) * 60 + Number(splited[1])
    this.setData({
      OtherTimeStart: this.data.OtherTimeStart
    })
  },

  OtherTimeEndChange: function (e) {
    var time = e.detail.value
    var splited = time.split(":")
    OETH = Number(splited[0]) * 60 + Number(splited[1])
    if (OETH > OSTH) {
      this.data.OtherTimeEnd = e.detail.value
      this.setData({
        OtherTimeEnd: this.data.OtherTimeEnd
      })
    } else {
      wx.showModal({
        title: '错误',
        content: '结束时间必须在开始时间之后',
        showCancel: false,
      })
    }
  },

  OtherDaySelect: function (e) {
    var id = e.target.id
    if (id == "OtherDay-M") {
      this.data.OtherDayMSelected = !this.data.OtherDayMSelected
      this.setData({
        OtherDayMSelected: this.data.OtherDayMSelected
      })
    } else if (id == "OtherDay-T") {
      this.data.OtherDayTSelected = !this.data.OtherDayTSelected
      this.setData({
        OtherDayTSelected: this.data.OtherDayTSelected
      })
    } else if (id == "OtherDay-W") {
      this.data.OtherDayWSelected = !this.data.OtherDayWSelected
      this.setData({
        OtherDayWSelected: this.data.OtherDayWSelected
      })
    } else if (id == "OtherDay-Th") {
      this.data.OtherDayThSelected = !this.data.OtherDayThSelected
      this.setData({
        OtherDayThSelected: this.data.OtherDayThSelected
      })
    } else if (id == "OtherDay-F") {
      this.data.OtherDayFSelected = !this.data.OtherDayFSelected
      this.setData({
        OtherDayFSelected: this.data.OtherDayFSelected
      })
    }
  },

  CancelBtnClick: function () {
    wx.navigateBack({
      delta: '1',
    })
  },

  SubmitBtnClick: function () {
    var passOK = true
    var passTime = []
    var passName = Info.Name
    var passNumber = Info.Number
    var passInstructor = Info.Instructor
    var passLocation = Info.Location
    var passOther
    for (var i = 0; i < currentTimes; i++) {
      var day = []
      var start = STH[i]
      var end = ETH[i]
      if (this.data.DayMSelected[i]) { day.push("M") }
      if (this.data.DayTSelected[i]) { day.push("T") }
      if (this.data.DayWSelected[i]) { day.push("W") }
      if (this.data.DayThSelected[i]) { day.push("Th") }
      if (this.data.DayFSelected[i]) { day.push("F") }
      var timeString = common.StringGenerate(day, this.data.timeStart[i], this.data.timeEnd[i])
      passTime.push({ Day: day, Start: start, End: end, String: timeString })
    }
    if (AddOther) {
      var day = []
      if (this.data.OtherDayMSelected) { day.push("M") }
      if (this.data.OtherDayTSelected) { day.push("T") }
      if (this.data.OtherDayWSelected) { day.push("W") }
      if (this.data.OtherDayThSelected) { day.push("Th") }
      if (this.data.OtherDayFSelected) { day.push("F") }
      var start = OSTH
      var end = OETH
      var timeString = common.StringGenerate(day, this.data.OtherTimeStart, this.data.OtherTimeEnd)
      passOther = [
        Info.OtherType,
        Info.OtherLocation,
        { Day: day, Start: start, End: end, String: timeString }
      ]
    }
    var passVal = {
      passName: passName,
      passNumber: passNumber,
      passInstructor: passInstructor,
      passTime: passTime,
      passLocation: passLocation,
      passOther: passOther,
      passOtherExist: AddOther,
    }
    if (Info.Number == ""){
      passOK = false
      this.setData({
        NumberPH: "color: #FF0000"
      })
    }
    if (!common.ETHOK(STH, ETH, currentTimes)){
      passOK = false
    }
    if (!common.ETHOK(OSTH, OETH, 1) && AddOther){
      passOK = false
    }


    if (passOK) {
      common.addCourse(passVal)
      common.needUpdateList = true
      wx.reLaunch({
        url: '../settings/settings?Added=true',
      })
    } else if (!common.ETHOK(STH, ETH, currentTimes)){
      wx.showModal({
        title: '错误',
        content: '请检查时间是否填写正确',
        showCancel: false
      })
    } else if (!common.ETHOK(OSTH, OETH, 1) && AddOther){
      wx.showModal({
        title: '错误',
        content: '请检查时间是否填写正确',
        showCancel: false
      })
    } else{
      wx.showModal({
        title: '错误',
        content: '请填写必填部分',
        showCancel: false
      })
    }
  }
})