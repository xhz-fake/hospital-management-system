// pages/appointment/appointment.js
const app = getApp();

Page({
  data: {
    doctorId: null,
    doctorName: '',
    doctorTitle: '',
    doctorAvatar: '',
    departmentName: '',
    appointmentDate: '',
    timeSlot: '',
    patients: [],
    selectedPatientId: null,
    selectedPatient: null,
    showSuccess: false,
    orderInfo: null
  },

  onLoad(options) {
    this.setData({
      doctorId: options.doctorId,
      doctorName: options.doctorName ? decodeURIComponent(options.doctorName) : '',
      doctorTitle: options.doctorTitle ? decodeURIComponent(options.doctorTitle) : '',
      doctorAvatar: options.doctorAvatar ? decodeURIComponent(options.doctorAvatar) : '',
      departmentName: options.departmentName ? decodeURIComponent(options.departmentName) : '',
      appointmentDate: options.date || '',
      timeSlot: options.time || ''
    });
    this.loadPatients();
  },

  loadPatients() {
    const patients = app.globalData.patients || [];
    if (patients.length > 0) {
      this.setData({
        patients: patients,
        selectedPatientId: patients[0].id,
        selectedPatient: patients[0]
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请先添加就诊人',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/addPatient/addPatient'
            });
          } else {
            wx.navigateBack();
          }
        }
      });
    }
  },

  selectPatient(e) {
    const patient = e.currentTarget.dataset.patient;
    this.setData({
      selectedPatientId: patient.id,
      selectedPatient: patient
    });
  },

  confirmAppointment() {
    if (!this.data.selectedPatient) {
      wx.showToast({
        title: '请选择就诊人',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '预约中...'
    });

    // 构建预约时间（格式：yyyy-MM-dd HH:mm:ss）
    const [rawStart] = (this.data.timeSlot || '').split('-');
    let normalizedTime = (rawStart || '').trim();
    if (normalizedTime.includes(':')) {
      const [h = '0', m = '0'] = normalizedTime.split(':');
      normalizedTime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    } else if (normalizedTime) {
      normalizedTime = `${normalizedTime.padStart(2, '0')}:00`;
    } else {
      normalizedTime = '08:00';
    }
    const appointmentDateTime = `${this.data.appointmentDate} ${normalizedTime}:00`;

    app.request({
      url: '/appointments/create',
      method: 'POST',
      data: {
        patientId: this.data.selectedPatient.id,
        doctorId: this.data.doctorId,
        appointmentTime: appointmentDateTime,
        timeSlot: this.data.timeSlot,
        symptomDescription: '患者预约',
        departmentLocation: '门诊楼3楼' + this.data.departmentName
      }
    }).then(res => {
      // 生成订单信息
      const orderInfo = {
        doctorName: this.data.doctorName,
        doctorTitle: this.data.doctorTitle,
        departmentName: this.data.departmentName,
        appointmentTime: appointmentDateTime,
        fee: 91,
        orderNumber: res.orderNumber,
        patientName: this.data.selectedPatient.name,
        doctorAvatar: this.data.doctorAvatar || ''
      };

      this.setData({
        showSuccess: true,
        orderInfo: orderInfo
      });

      // 创建通知消息
      this.createNotification(res);

      this.navigateToSuccessPage(orderInfo, res);

      // 刷新就诊人列表
      setTimeout(() => {
        this.loadPatients();
      }, 2000);
    }).catch(err => {
      wx.showToast({
        title: err.message || '预约失败',
        icon: 'none'
      });
    }).finally(() => {
      try { wx.hideLoading(); } catch (e) {}
    });
  },

  createNotification(appointment) {
    const notifications = wx.getStorageSync('notifications') || [];
    const notification = {
      id: Date.now(),
      type: '预约成功',
      title: '预约成功通知',
      content: `预约时间：${this.data.appointmentDate} ${this.data.timeSlot}`,
      appointmentId: appointment.id,
      doctorName: this.data.doctorName,
      patientName: this.data.selectedPatient.name,
      departmentName: this.data.departmentName,
      appointmentTime: appointment.appointmentTime,
      time: new Date().toLocaleString(),
      isRead: 0
    };
    notifications.unshift(notification);
    wx.setStorageSync('notifications', notifications);
  },

  goToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  viewAppointmentDetail() {
    wx.navigateTo({
      url: '/pages/myAppointments/myAppointments'
    });
  },

  navigateToSuccessPage(orderInfo, appointment) {
    const eventData = {
      ...orderInfo,
      appointmentId: appointment?.id,
      timeSlot: this.data.timeSlot,
      departmentName: this.data.departmentName,
      doctorAvatar: orderInfo.doctorAvatar || '/assets/default-avatar.png'
    };

    wx.navigateTo({
      url: '/pages/appointmentSuccess/appointmentSuccess',
      success: (res) => {
        if (res && res.eventChannel) {
          res.eventChannel.emit('appointmentSuccessData', eventData);
        }
      }
    });
  }
});

