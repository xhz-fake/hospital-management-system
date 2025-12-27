// pages/map/map.js
Page({
  openWechatMap() {
    wx.openLocation({
      latitude: 37.428230,   // 纬度，必填
      longitude: -122.168861, // 经度，必填
      name: '斯坦福大学医学院',    // 位置名，必填
      address: '美国加州旧金山湾区南部帕罗奥多市', // 详细地址，可选但建议填写
      scale: 18 // 地图缩放级别，可选
    });
  }
});

