// pages/index/index.js
const app = getApp();

Page({
  data: {
    searchKeyword: '',
    patients: []
  },

  onLoad() {
    this.loadPatients();
  },

  onShow() {
    // 每次显示页面时刷新就诊人列表
    this.loadPatients();
  },

  // 加载就诊人列表
  loadPatients() {
    const patients = app.globalData.patients || [];
    this.setData({
      patients: patients
    });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 跳转到添加就诊人页面
  goToAddPatient() {
    wx.navigateTo({
      url: '/pages/addPatient/addPatient'
    });
  },

  // 跳转到就诊卡页面
  goToPatientCard(e) {
    const patient = e.currentTarget.dataset.patient;
    wx.navigateTo({
      url: `/pages/patientCard/patientCard?id=${patient.id}&name=${patient.name}&idCard=${patient.idCard}`
    });
  },

  // 跳转到门诊页面
  goToOutpatient() {
    wx.switchTab({
      url: '/pages/departmentList/departmentList'
    });
  },

  // 跳转到缴费页面
  goToPayment() {
    wx.navigateTo({
      url: '/pages/paymentRecords/paymentRecords'
    });
  },

  // 跳转到病历页面
  goToMedicalRecords() {
    wx.navigateTo({
      url: '/pages/medicalRecords/medicalRecords'
    });
  },

  // 跳转到医院简介
  goToHospitalInfo() {
    wx.navigateTo({
      url: '/pages/hospitalInfo/hospitalInfo'
    });
  },

  // 跳转到服务指南
  goToServiceGuide() {
    wx.navigateTo({
      url: '/pages/serviceGuide/serviceGuide'
    });
  },

  // 跳转到科室列表
  goToDepartmentList() {
    wx.switchTab({
      url: '/pages/departmentList/departmentList'
    });
  },

  // 跳转到地图
  goToMap() {
    wx.navigateTo({
      url: '/pages/map/map'
    });
  }
});

