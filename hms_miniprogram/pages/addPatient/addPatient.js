// pages/addPatient/addPatient.js
const app = getApp();

Page({
  data: {
    formData: {
      name: '',
      idCard: '',
      phone: ''
    }
  },

  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  onIdCardInput(e) {
    this.setData({
      'formData.idCard': e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value
    });
  },

  // 提交添加就诊人
  submit() {
    const { name, idCard, phone } = this.data.formData;

    // 表单验证
    if (!name || !idCard || !phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 验证身份证号格式
    const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/;
    if (!idCardReg.test(idCard)) {
      wx.showToast({
        title: '身份证号格式不正确',
        icon: 'none'
      });
      return;
    }

    // 验证手机号格式
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }

    // 检查是否已存在
    const patients = app.globalData.patients || [];
    const exist = patients.find(p => p.idCard === idCard);
    if (exist) {
      wx.showToast({
        title: '该身份证号已存在',
        icon: 'none'
      });
      return;
    }

    // 调用API添加就诊人
    wx.showLoading({
      title: '添加中...'
    });

    app.request({
      url: '/patients/register',
      method: 'POST',
      data: this.data.formData
    }).then(res => {
      // 添加到本地就诊人列表
      const newPatients = [...patients, res];
      app.savePatients(newPatients);

      // 创建通知消息
      this.createNotification(res);

      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    }).catch(async err => {
      // 若后端提示身份证已存在，则尝试通过身份证号查询并恢复到本地
      const dup = (err && (err.message || err.msg || err.error)) && String(err.message || err.msg || err.error).includes('已存在');
      if (dup) {
        try {
          const existPatient = await app.request({
            url: `/patients/idcard/${idCard}`,
            method: 'GET'
          });
          if (existPatient && !patients.find(p => p.id === existPatient.id)) {
            app.savePatients([...patients, existPatient]);
          }
          wx.showToast({
            title: '已恢复就诊人',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
          return;
        } catch (e) {
          // ignore and fall through
        }
      }
      wx.showToast({
        title: err.message || '添加失败',
        icon: 'none'
      });
    }).finally(() => {
      try { wx.hideLoading(); } catch (e) {}
    });
  },

  // 创建建档成功通知
  createNotification(patient) {
    const notifications = wx.getStorageSync('notifications') || [];
    const notification = {
      id: Date.now(),
      type: '建档成功',
      title: '建档成功通知',
      content: `您好！${patient.name}在我院建档成功！`,
      patientName: patient.name,
      patientId: patient.idCard,
      time: new Date().toLocaleString(),
      isRead: 0
    };
    notifications.unshift(notification);
    wx.setStorageSync('notifications', notifications);
  }
});

