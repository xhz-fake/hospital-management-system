// pages/my/my.js
Page({
  goToMyAppointments() {
    wx.navigateTo({
      url: '/pages/myAppointments/myAppointments'
    });
  },

  goToPayment() {
    wx.navigateTo({
      url: '/pages/paymentRecords/paymentRecords'
    });
  },

  goToMedicalRecords() {
    wx.navigateTo({
      url: '/pages/medicalRecords/medicalRecords'
    });
  },

  goToMessages() {
    wx.navigateTo({
      url: '/pages/messages/messages'
    });
  },

  goToMyPatients() {
    wx.navigateTo({
      url: '/pages/myPatients/myPatients'
    });
  }
});

