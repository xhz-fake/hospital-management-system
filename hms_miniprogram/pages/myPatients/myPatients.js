// pages/myPatients/myPatients.js
const app = getApp();

Page({
  data: {
    patients: []
  },

  onLoad() {
    this.loadPatients();
  },

  onShow() {
    this.loadPatients();
  },

  loadPatients() {
    const patients = app.globalData.patients || [];
    this.setData({
      patients: patients
    });
  },

  editPatient(e) {
    const patient = e.currentTarget.dataset.patient;
    wx.navigateTo({
      url: `/pages/editPatient/editPatient?id=${patient.id}&name=${patient.name}&idCard=${patient.idCard}&phone=${patient.phone}`
    });
  },

  deletePatient(e) {
    const id = e.currentTarget.dataset.id;
    const patient = this.data.patients.find(p => p.id === id);
    
    wx.showModal({
      title: '提示',
      content: `是否删除该就诊人${patient.name}？`,
      success: (res) => {
        if (res.confirm) {
          const patients = this.data.patients.filter(p => p.id !== id);
          app.savePatients(patients);
          this.setData({
            patients: patients
          });
          
          // 删除后端数据
          app.request({
            url: `/patients/${id}`,
            method: 'DELETE'
          }).catch(err => {
            console.error('删除失败', err);
          });
        }
      }
    });
  },

  goToAddPatient() {
    wx.navigateTo({
      url: '/pages/addPatient/addPatient'
    });
  }
});

