// pages/medicalRecords/medicalRecords.js
const app = getApp();

Page({
  data: {
    patients: [],
    patientNames: [],
    selectedPatientIndex: 0,
    currentPatientId: null,
    currentPatientName: '请选择患者',
    selectedTimeRange: 'month',
    records: []
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
      this.loadRecords();
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
    this.loadRecords();
  },

  selectTimeRange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({
      selectedTimeRange: range
    });
    this.loadRecords();
  },

  loadRecords() {
    if (!this.data.currentPatientId) return;

    wx.showLoading({
      title: '加载中...'
    });

    app.request({
      url: `/medical-records/patient/${this.data.currentPatientId}`,
      method: 'GET'
    }).then(res => {
      wx.hideLoading();
      
      // 根据时间范围筛选
      let records = res || [];
      const now = new Date();
      const timeRangeMap = {
        month: 30,
        quarter: 90,
        year: 365
      };
      const days = timeRangeMap[this.data.selectedTimeRange] || 30;
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      records = records.filter(r => {
        if (!r.createdTime) return false;
        return new Date(r.createdTime) >= cutoffDate;
      });
      
      this.setData({
        records: records
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    });
  },

  goToCreateRecord() {
    if (!this.data.currentPatientId) {
      wx.showToast({
        title: '请先选择患者',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/createMedicalRecord/createMedicalRecord?patientId=${this.data.currentPatientId}&patientName=${encodeURIComponent(this.data.currentPatientName)}`
    });
  },

  viewRecord(e) {
    const record = e.currentTarget.dataset.record;
    wx.showModal({
      title: '病历详情',
      content: `诊断：${record.diagnosis || '暂无'}\n\n治疗方案：${record.treatment || '暂无'}\n\n处方：${record.prescription || '暂无'}`,
      showCancel: false
    });
  },

  previewFile(e) {
    const url = e.currentTarget.dataset.url;
    if (!url) return;
    // 简单判断是否是图片
    const fileUrl = this.resolveFileUrl(url);
    const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(fileUrl);
    if (isImage) {
      wx.previewImage({
        urls: [fileUrl]
      });
    } else {
      wx.showModal({
        title: '附件',
        content: '暂不支持在小程序内直接预览该类型附件，请在医生端或复制链接到浏览器打开。',
        confirmText: '复制链接',
        success: (res) => {
          if (res.confirm) {
            wx.setClipboardData({ data: fileUrl });
          }
        }
      });
    }
  },

  formatDateTime(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },

  resolveFileUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    const baseUrl = app.globalData.baseUrl || '';
    if (!baseUrl) return url;
    if (url.startsWith('/')) {
      return baseUrl + url;
    }
    return `${baseUrl}/${url}`;
  }
});

