// pages/settings/settings.js

/*
  Course Fomat
  {
    Order: 1,
    Name: "BU111",
    Instructor: "Dave Thompskin",
    Time:[
      {Day: ["M", "W", "F"], Start: "11:30", End: "12:50", Duration: 80, String: "11:30 - 12:50 MWF"},
      {Day: ["T", "Th"], Start: "10:00", End: "11:20", Duration: 80, String: "10:00 - 11:20 TTh"},
    ],
    Location: "HH1001",
    Other: ["LAB", "HH1002", {Day: ["M"], Start: "15:30", End: "16:20", Duration: 50, String: "15:30 - 16:20 M"}]
  }
*/

var app = getApp()
var common = require("../../common.js")
var Added = false
var Edited = false

Page({
  data: {
    AddNoticeHidden: false,
  },

  onLoad: function(options){
    var userinfo = wx.getStorageSync("USERINFO")
    var courselist = wx.getStorageSync("COURSELIST")
    this.setData({
      UserInfo: userinfo,
      CourseList: courselist
    })
    if (options.Added){
      Added = true
      Edited = false
    } else if (options.Edited){
      Added = false
      Edited = true
    }
  },

  onShow: function(){
    if (Added){
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 700,
        mask: true
      })
      Added = false
    } else if (Edited){
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 700,
        mask: true
      })
	  Edited = false
    }
    var ALlen = this.data.CourseList.length
    if (ALlen == 0) {
      this.setData({
        AddNoticeHidden: false,
      })
    } else if (ALlen > 0) {
      this.setData({
        AddNoticeHidden: true,
      })
    }
  },

  ToAboutPage: function(){
    wx.navigateTo({
      url: '../about/about',
    })
  },

  ToAddCourse: function(){
    wx.navigateTo({
      url: '../addCourse/addCourse',
    })
  },

  EditFunction: function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../editCourse/editCourse?CourseOrder=' + id,
    })
  },

  DeleteFunction: function(e){
    var delId = e.currentTarget.dataset.id
    let _this = this
    wx.showModal({
      title: '注意',
      content: '确定删除该课程吗？',
      showCancel: true,
      confirmText: '确定',
      confirmColor: '#FF0000',
      success: function(res) {
        if (res.confirm){
          _this.DelConfirm(delId)
        }
      }
    })
  },

  DelConfirm: function(delId){
    var courseList = this.data.CourseList
    var DeleteConfirm = false
    var length = courseList.length
    var updateList = []
    if (length == 1) {
      wx.setStorageSync("COURSELIST", updateList)
      this.setData({
        CourseList: updateList
      })
    } else {
      for (var i = 0; i < delId - 1; i++) {
        updateList.push(courseList[i])
      }
      for (var i = delId; i < length; i++) {
        courseList[i].Order--
        updateList.push(courseList[i])
      }
      wx.setStorageSync("COURSELIST", updateList)
      this.setData({
        CourseList: updateList
      })
    }
    common.needUpdateList = true
    wx.showToast({
      title: '删除成功',
      image: '../../resources/DeleteIcon.png',
      duration: 700,
      mask: true
    })
    this.setData({
      ModalHidden: true
    })
  },

  ClearFunction: function(){
    let _this = this
    wx.showModal({
      title: '注意',
      content: '点击确定将删除所有课程，并且无法撤销，确定清空列表吗？',
      showCancel: true,
      confirmText: '确定',
      confirmColor: '#FF0000',
      success: function(res) {
        if (res.confirm){
          _this.ClearConfirm()
        }
      },
    })
  },

  ClearConfirm: function(){
    var clear = []
    wx.setStorageSync("COURSELIST", clear)
    this.setData({
      CourseList: clear,
    })
    common.needUpdateList = true
    wx.showToast({
      title: '清空成功',
      image: '../../resources/DeleteIcon.png',
      duration: 700,
      mask: true
    })
  },

  onShareAppMessage: function () {
    return {
      title: "有了Mr.课表，上课不迟到！",
      path: "/pages/index/index",
      imageUrl: "../../resources/SharePic.png"
    }
  },
})