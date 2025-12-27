// pages/doctorDetail/doctorDetail.js
const app = getApp();

Page({
  data: {
    doctorId: null,
    departmentName: '',
    doctor: {},
    currentTab: 'appointment',
    selectedDate: null,
    selectedTime: null,
    dateList: [],
    timeSlots: ['8-9', '9-10', '10-11', '11-12', '14-15', '15-16', '16-17', '17-18']
  },

  onLoad(options) {
    this.setData({
      doctorId: options.doctorId,
      departmentName: options.departmentName || '超声科'
    });
    this.loadDoctor();
    this.initDateList();
  },

  loadDoctor() {
    app.request({
      url: `/doctors/${this.data.doctorId}`,
      method: 'GET'
    }).then(res => {
      this.setData({
        doctor: res
      });
    }).catch(err => {
      wx.showToast({
        title: '加载医生信息失败',
        icon: 'none'
      });
    });
  },

  initDateList() {
    const dates = [];
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const week = weekDays[date.getDay()];
      
      dates.push({
        date: `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        dateText: `${month}/${day}`,
        week: week
      });
    }
    
    this.setData({
      dateList: dates
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab,
      selectedDate: null,
      selectedTime: null
    });
  },

  selectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({
      selectedDate: date,
      selectedTime: null
    });
  },

  selectTime(e) {
    const time = e.currentTarget.dataset.time;
    this.setData({
      selectedTime: time
    });
  },

  cancelAppointment() {
    this.setData({
      selectedDate: null,
      selectedTime: null
    });
  },

  confirmAppointment() {
    if (!this.data.selectedDate || !this.data.selectedTime) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      });
      return;
    }

    const patients = app.globalData.patients || [];
    if (patients.length === 0) {
      wx.showToast({
        title: '请先添加就诊人',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/addPatient/addPatient'
        });
      }, 1500);
      return;
    }

    // 跳转到预约页面
    const doctor = this.data.doctor || {};
    const params = [
      `doctorId=${this.data.doctorId}`,
      `doctorName=${encodeURIComponent(doctor.name || '')}`,
      `departmentName=${encodeURIComponent(this.data.departmentName)}`,
      `doctorTitle=${encodeURIComponent(doctor.title || '')}`,
      `doctorAvatar=${encodeURIComponent(doctor.avatarUrl || '')}`,
      `date=${this.data.selectedDate}`,
      `time=${this.data.selectedTime}`,
      `timeSlot=${this.data.selectedTime}`
    ].join('&');

    wx.navigateTo({
      url: `/pages/appointment/appointment?${params}`
    });
  }
});

