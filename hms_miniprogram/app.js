// app.js
App({
  globalData: {
    baseUrl: 'http://172.24.23.14:8080/api', // 后端API地址，需要根据实际情况修改
    userInfo: null,
    patients: [] // 当前用户绑定的就诊人列表
  },

  onLaunch() {
    // 获取用户信息
    this.getUserInfo();
    // 加载就诊人列表
    this.loadPatients();
  },

  // 获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.globalData.userInfo = res.userInfo;
      },
      fail: () => {
        this.globalData.userInfo = { nickName: '微信用户' };
      }
    });
  },

  // 加载就诊人列表
  loadPatients() {
    // 从本地存储读取就诊人列表
    const patients = wx.getStorageSync('patients') || [];
    this.globalData.patients = patients;
  },

  // 保存就诊人列表
  savePatients(patients) {
    this.globalData.patients = patients;
    wx.setStorageSync('patients', patients);
  },

  // API请求封装
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'content-type': 'application/json',
          ...options.header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.code === 200) {
              resolve(res.data.data);
            } else {
              wx.showToast({
                title: res.data.message || '操作失败',
                icon: 'none'
              });
              reject(res.data);
            }
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  }
});

