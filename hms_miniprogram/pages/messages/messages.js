// pages/messages/messages.js
Page({
  data: {
    messages: []
  },

  onLoad() {
    this.loadMessages();
  },

  onShow() {
    this.loadMessages();
  },

  loadMessages() {
    const messages = wx.getStorageSync('notifications') || [];
    // 按时间倒序排列
    messages.sort((a, b) => {
      return new Date(b.time || 0) - new Date(a.time || 0);
    });
    this.setData({
      messages: messages
    });
  },

  viewMessage(e) {
    const message = e.currentTarget.dataset.message;
    // 标记为已读
    const messages = wx.getStorageSync('notifications') || [];
    const index = messages.findIndex(m => m.id === message.id);
    if (index >= 0) {
      messages[index].isRead = 1;
      wx.setStorageSync('notifications', messages);
      this.loadMessages();
    }
  }
});

