//获取应用实例，完成页面的逻辑包括功能实现
var util = require('../../utils/util.js');//调用工具库
Page({
  //定义页面变量
  data: {
    //文本框数据模型
    input: '',
    //任务列表数据模型
    todos: [],
    leftCount: 0,
    allCompleted: false,
    logs: []
  },
  //保存方法，将todo-list和todo-logs保存在小程序本地，通过调用小程序开放api wx.setStorageSync（）
  save: function () {
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
  },
  //加载本地缓存中的todo-list
  load: function () {
    var todos = wx.getStorageSync('todo_list')
    if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ todos: todos, leftCount: leftCount })
    }
    var logs = wx.getStorageSync('todo_logs')
    console.log(logs)
    console.log(todos)
    if (logs) {
      this.setData({ logs: logs })
    }
  },
  onLoad: function () {
    // 调用函数时，传入 new Date（）函数，返回值是日期和时间
    //var timestamp = util.formatTime(new Date());
    // 再通过 setData 更改 Page（）里面的 data，动态更新页面的数据
    // this.setData({
    //   timestamp: time
    // });
    this.load()
  },
  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
  },
  //增加任务
  addTodoHandle: function (e) {
    if (!this.data.input || !this.data.input.trim()) return
    var todos = this.data.todos
    //获取时间戳
    var currenttime = this.data.timeStamp;
    //简化时间格式
    var time = util.formatTime(currenttime, 'Y/M/D')
    //console.log(util.formatTime(currenttime, 'Y/M/D h:m:s'));
    //将任务数据push到map中
    todos.push({ timestamp: time, name: this.data.input, completed: false })
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Add', name: this.data.input })
    this.setData({
      input: '',
      todos: todos,
      leftCount: this.data.leftCount + 1,
      logs: logs
    })
    this.save()
  },
  //完成任务
  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? 'Finish' : 'Restart',
      name: todos[index].name
    })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
      logs: logs
    })
    this.save()
  },
  //删除任务
  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    var remove = todos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Remove', name: remove.name })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
      logs: logs
    })
    this.save()
  },
 //完成全部任务
  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    this.setData({
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length,
      logs: logs
    })
    this.save()
  },
 //清除全部已完成
  clearCompletedHandle: function (e) {
    var todos = this.data.todos
    var remains = []
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i])
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    this.setData({ todos: remains, logs: logs })
    this.save()
  }
})
