// pages/paymentRecords/paymentRecords.js
const app = getApp();

Page({
  data: {
    patients: [],
    patientNames: [],
    selectedPatientIndex: 0,
    currentPatientId: null,
    currentPatientName: '请选择患者',
    payments: []
  },

  onLoad() {
    this.loadPatients();
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
      this.loadPayments();
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
    this.loadPayments();
  },

  loadPayments() {
    if (!this.data.currentPatientId) return;

    // 从预约记录中获取已完成的预约作为缴费记录
    app.request({
      url: `/appointments/patient/${this.data.currentPatientId}`,
      method: 'GET',
      data: {
        current: 1,
        size: 100
      }
    }).then(res => {
      // 只显示已就诊的预约（视为已缴费）
      const payments = (res.records || []).filter(a => a.status === 1).map(a => ({
        id: a.id,
        doctorName: a.doctorName || '医生',
        doctorTitle: a.doctorTitle || '',
        doctorAvatar: a.doctorAvatar || '',
        departmentName: a.departmentName || '科室',
        orderNumber: a.orderNumber,
        patientName: a.patientName || '',
        fee: a.fee || 91,
        createdTime: a.createdTime
      }));
      
      this.setData({
        payments: payments
      });
    }).catch(err => {
      console.error('加载缴费记录失败', err);
    });
  },

  formatDateTime(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
});

