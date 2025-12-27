// pages/patientCard/patientCard.js
Page({
  data: {
    patientName: '',
    patientIdCard: ''
  },

  onLoad(options) {
    this.setData({
      patientName: options.name || '',
      patientIdCard: options.idCard || ''
    });
  }
});

