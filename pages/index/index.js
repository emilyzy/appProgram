//index.js
//获取应用实例
const app = getApp()

Page({
  // 数据 对应着 界面状态
  data: {
    // 默认的status是1是全部
    // setData改变 比如改成2 setData 2 已完成 3 未完成
    status: 1,
    lists: [],
    curLists: [],
    // 界面状态,全部被data接管起来
    addShow: true,
    lists: [{
      title: '第一个任务',
      time: '十分钟前',
      status: '1'
    },
    {
      title: '第二个任务',
      time: '刚刚',
      status: '0'
    }

    ],
    addText: ''
  },

  showStatus: function (e) {
    //  文字/?\

    const status = e.currentTarget.dataset.status
    if (this.data.status === status) return
    if (status === '1') {
      this.setData({
        status: status,
        curLists: this.data.lists
      })
      return
    }
    this.setData({
      status: status,
      curLists: this.data.lists.filter(item => +item.status === (status - 2))
    })

  },

  addTodoShow: function (e) {
    this.setData({
      addShow: false
    })

  },
  addTodo: function (e) {
    //  ?
    // 输入框的内容
    if (!this.data.addText.trim()) {
      return
    }
    const task = {
      title: this.data.addText,
      status: '0',
      time: '刚刚'
    }
    const temp = [...this.data.lists,
      task]
    this.setData({
      lists: temp,
      addShow: true
    })
    wx.showToast({
      title: '添加成功!',
      icon: 'success',
      duration: 1000
    });
    // 看到界面 我们就知道要的数据了
    // 看到交互,对数据操作
    // ?如何添加新的Todo?
    // 页面上多一条任务
    // 显示多少条是由lists决定的
    // lists push 
    // 数据驱动界面 数据变 界面自动更新
    // MVVM Model(数据模型data)View VM(视图模型层)
  },
  addTodoHide: function (e) {
    this.setData({
      addShow: true,
      addText: '',
      focuse: false
    })
  },
  setInput: function (e) {
    //  console.log(e,detail.value)
    this.setData({
      addText: e.detail.value
    })
  },
  changeTodo: function (e) {
    //  当前点击条目的status要变成 success 数据 lists 跟当前条目相关的数据
    // 将status的值 更新为 1
    const index = e.currentTarget.dataset.item;
    const temp = this.data.lists;
    temp.forEach((item, i) => {
      // console.log(item, i);
      if (i == index) {
        if (item.status == '0') {
          item.status = '1'
          wx.showToast({
            title: '已完成任务',
            icon: 'success',
            duration: 1000
          })
        } else {
          item.status = '0'
          wx.showToast({
            title: '任务打回重做',
            icon: 'circle',
            duration: 1000
          })
        }
      }
      this.setData({
        lists: temp,
        // addShow:true
      })
    })
  }
})
