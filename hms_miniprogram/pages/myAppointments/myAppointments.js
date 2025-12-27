// pages/myAppointments/myAppointments.js
const app = getApp();

Page({
  data: {
    patients: [],
    patientNames: [],
    selectedPatientIndex: 0,
    currentPatientId: null,
    currentPatientName: '请选择患者',
    appointments: []
  },

  onLoad() {
    this.loadPatients();
  },

  onShow() {
    if (this.data.currentPatientId) {
      this.loadAppointments();
    }
  },

  loadPatients() {
    const patients = app.globalData.patients || [];
    const patientNames = patients.map(p => p.name);
    
    this.setData({
      patients: patients,
      patientNames: patientNames,
      currentPatientId: patients.length > 0 ? patients[0].id : null,
      currentPatientName: patients.length > 0 ? patients[0].name : '请选择患者',
      selectedPatientIndex: 0
    });

    if (patients.length > 0) {
      this.loadAppointments();
    }
  },

  onPatientChange(e) {
    const index = e.detail.value;
    const patient = this.data.patients[index];
    this.setData({
      selectedPatientIndex: index,
      currentPatientId: patient.id,
      currentPatientName: patient.name
    });
    this.loadAppointments();
  },

  loadAppointments() {
    if (!this.data.currentPatientId) return;

    wx.showLoading({
      title: '加载中...'
    });

    app.request({
      url: `/appointments/patient/${this.data.currentPatientId}`,
      method: 'GET',
      data: {
        current: 1,
        size: 100
      }
    }).then(res => {
      const appointments = res.records || [];
      this.setData({
        appointments: res.records || []
      });
      this.syncDoctorCancelNotifications(appointments);
    }).catch(err => {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }).finally(() => {
      try { wx.hideLoading(); } catch (e) {}
    });
  },

  cancelAppointment(e) {
    const id = e.currentTarget.dataset.id;
    const appointment = this.data.appointments.find(a => a.id === id);

    wx.showModal({
      title: '取消预约',
      content: '您确定要取消预约吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...'
          });

          app.request({
            url: `/appointments/${id}/cancel?patientId=${this.data.currentPatientId}`,
            method: 'POST'
          }).then(result => {
            wx.showToast({
              title: '取消成功',
              icon: 'success'
            });

            // 创建取消通知
            this.createCancelNotification(appointment);
            this.loadAppointments();
          }).catch(err => {
            wx.showToast({
              title: err.message || '取消失败',
              icon: 'none'
            });
          }).finally(() => {
            try { wx.hideLoading(); } catch (e) {}
          });
        }
      }
    });
  },

  createCancelNotification(appointment) {
    const notifications = wx.getStorageSync('notifications') || [];
    const notification = {
      id: Date.now(),
      type: '取消预约',
      title: '取消预约成功通知',
      content: `预约时间：${this.formatDateTime(appointment.appointmentTime)}`,
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      patientName: appointment.patientName,
      departmentName: appointment.departmentName,
      appointmentTime: appointment.appointmentTime,
      time: new Date().toLocaleString(),
      isRead: 0
    };
    notifications.unshift(notification);
    wx.setStorageSync('notifications', notifications);
  },

  getStatusText(status) {
    const statusMap = {
      0: '待就诊',
      1: '已就诊',
      2: '个人取消',
      3: '医生取消'
    };
    return statusMap[status] || '未知';
  },

  getStatusClass(status) {
    const classMap = {
      0: 'pending',
      1: 'completed',
      2: 'cancelled',
      3: 'cancelled'
    };
    return classMap[status] || '';
  },

  formatDateTime(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  syncDoctorCancelNotifications(appointments) {
    if (!Array.isArray(appointments)) return;
    const notifications = wx.getStorageSync('notifications') || [];
    let updated = false;

    appointments.forEach(item => {
      if (item.status === 3) {
        const exists = notifications.some(n => n.appointmentId === item.id && n.type === '医生取消');
        if (!exists) {
          notifications.unshift({
            id: Date.now() + Math.random(),
            type: '医生取消',
            title: '医生取消预约通知',
            content: `医生已取消 ${item.departmentName || ''} ${item.doctorName || ''} ${this.formatDateTime(item.appointmentTime)} ${item.timeSlot} 的预约`,
            appointmentId: item.id,
            doctorName: item.doctorName,
            patientName: item.patientName,
            departmentName: item.departmentName,
            appointmentTime: item.appointmentTime,
            time: new Date().toLocaleString(),
            isRead: 0
          });
          updated = true;
        }
      }
    });

    if (updated) {
      wx.setStorageSync('notifications', notifications);
    }
  }
});

