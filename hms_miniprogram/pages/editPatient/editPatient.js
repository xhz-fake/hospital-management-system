// pages/editPatient/editPatient.js
const app = getApp();

Page({
  data: {
    patientId: null,
    formData: {
      name: '',
      idCard: '',
      phone: '',
      gender: 0,
      birthDate: '',
      residence: '',
      address: ''
    },
    genderOptions: ['女', '男']
  },

  onLoad(options) {
    this.setData({
      patientId: options.id,
      'formData.name': options.name || '',
      'formData.idCard': options.idCard || '',
      'formData.phone': options.phone || ''
    });
    this.loadPatient();
  },

  loadPatient() {
    if (!this.data.patientId) return;

    app.request({
      url: `/patients/${this.data.patientId}`,
      method: 'GET'
    }).then(res => {
      this.setData({
        'formData.gender': res.gender !== undefined ? res.gender : 0,
        'formData.birthDate': res.birthDate || '',
        'formData.residence': res.residence || '',
        'formData.address': res.address || ''
      });
    }).catch(err => {
      console.error('加载患者信息失败', err);
    });
  },

  onGenderChange(e) {
    this.setData({
      'formData.gender': parseInt(e.detail.value)
    });
  },

  onBirthDateChange(e) {
    this.setData({
      'formData.birthDate': e.detail.value
    });
  },

  onResidenceInput(e) {
    this.setData({
      'formData.residence': e.detail.value
    });
  },

  onAddressInput(e) {
    this.setData({
      'formData.address': e.detail.value
    });
  },

  savePatient() {
    wx.showLoading({
      title: '保存中...'
    });

    app.request({
      url: `/patients/${this.data.patientId}`,
      method: 'PUT',
      data: this.data.formData
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });

      // 更新本地就诊人列表
      const patients = app.globalData.patients || [];
      const index = patients.findIndex(p => p.id === this.data.patientId);
      if (index >= 0) {
        patients[index] = { ...patients[index], ...this.data.formData };
        app.savePatients(patients);
      }

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: err.message || '保存失败',
        icon: 'none'
      });
    });
  },

  deletePatient() {
    const patient = app.globalData.patients.find(p => p.id === this.data.patientId);
    
    wx.showModal({
      title: '提示',
      content: `是否删除${patient.name}患者？`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...'
          });

          app.request({
            url: `/patients/${this.data.patientId}`,
            method: 'DELETE'
          }).then(result => {
            wx.hideLoading();
            
            // 从本地列表中删除
            const patients = app.globalData.patients.filter(p => p.id !== this.data.patientId);
            app.savePatients(patients);

            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });

            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }).catch(err => {
            wx.hideLoading();
            wx.showToast({
              title: err.message || '删除失败',
              icon: 'none'
            });
          });
        }
      }
    });
  }
});

