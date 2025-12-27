Page({
  data: {
    info: {
      doctorAvatar: '/assets/default-avatar.png',
      doctorName: '',
      doctorTitle: '',
      departmentName: '',
      appointmentTime: '',
      timeSlot: '',
      fee: 91,
      orderNumber: '',
      patientName: ''
    },
    displayTime: ''
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('appointmentSuccessData', (data) => {
        this.updateInfo(data);
      });
    }

    if (options && Object.keys(options).length > 0) {
      const data = {
        doctorAvatar: options.doctorAvatar ? decodeURIComponent(options.doctorAvatar) : undefined,
        doctorName: options.doctorName ? decodeURIComponent(options.doctorName) : undefined,
        doctorTitle: options.doctorTitle ? decodeURIComponent(options.doctorTitle) : undefined,
        departmentName: options.departmentName ? decodeURIComponent(options.departmentName) : undefined,
        appointmentTime: options.appointmentTime ? decodeURIComponent(options.appointmentTime) : undefined,
        timeSlot: options.timeSlot ? decodeURIComponent(options.timeSlot) : undefined,
        orderNumber: options.orderNumber ? decodeURIComponent(options.orderNumber) : undefined,
        patientName: options.patientName ? decodeURIComponent(options.patientName) : undefined
      };
      this.updateInfo(data);
    }
  },

  updateInfo(data = {}) {
    if (!data) return;
    const info = {
      ...this.data.info,
      ...data
    };
    if (!info.doctorAvatar) {
      info.doctorAvatar = '/assets/default-avatar.png';
    }
    if (typeof info.fee === 'undefined' || info.fee === null) {
      info.fee = 91;
    }
    this.setData({
      info,
      displayTime: this.formatDateTime(info.appointmentTime, info.timeSlot)
    });
  },

  formatDateTime(dateTime, timeSlot) {
    if (!dateTime) {
      return timeSlot ? timeSlot : '';
    }
    const date = new Date(dateTime.replace(/-/g, '/'));
    if (Number.isNaN(date.getTime())) {
      return `${dateTime}${timeSlot ? ` ${timeSlot}` : ''}`;
    }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const base = `${y}-${m}-${d} ${hh}:${mm}`;
    return timeSlot ? `${base}（${timeSlot}）` : base;
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  viewAppointments() {
    wx.navigateTo({
      url: '/pages/myAppointments/myAppointments'
    });
  }
});


