// pages/createMedicalRecord/createMedicalRecord.js
const app = getApp();

Page({
  data: {
    patientId: null,
    patientName: '',
    formData: {
      doctorId: null,
      diagnosis: '',
      treatment: '',
      prescription: '',
      recordContent: '',
      fileUrl: ''
    },
    fileName: '',
    doctorList: [],
    doctorNames: [],
    selectedDoctorIndex: 0,
    selectedDoctorName: '请选择医生'
  },

  onLoad(options) {
    this.setData({
      patientId: Number(options.patientId) || null,
      patientName: decodeURIComponent(options.patientName || '')
    });
    this.loadDoctors();
  },

  onDiagnosisInput(e) {
    this.setData({ 'formData.diagnosis': e.detail.value });
  },
  onTreatmentInput(e) {
    this.setData({ 'formData.treatment': e.detail.value });
  },
  onPrescriptionInput(e) {
    this.setData({ 'formData.prescription': e.detail.value });
  },
  onRecordContentInput(e) {
    this.setData({ 'formData.recordContent': e.detail.value });
  },

  loadDoctors() {
    wx.showLoading({ title: '加载医生...' });
    app.request({
      url: '/doctors/list',
      method: 'GET',
      data: {
        current: 1,
        size: 100,
        status: 1
      }
    }).then(res => {
      const records = (res && res.records) || [];
      const names = records.map(item => item.name || `医生${item.id}`);
      if (records.length > 0) {
        this.setData({
          doctorList: records,
          doctorNames: names,
          selectedDoctorIndex: 0,
          selectedDoctorName: names[0],
          'formData.doctorId': records[0].id
        });
      } else {
        this.setData({
          doctorList: [],
          doctorNames: [],
          selectedDoctorName: '暂无可选医生',
          'formData.doctorId': null
        });
      }
    }).catch(() => {
      wx.showToast({ title: '获取医生失败', icon: 'none' });
    }).finally(() => {
      try { wx.hideLoading(); } catch(e) {}
    });
  },

  onDoctorChange(e) {
    const index = Number(e.detail.value);
    const doctor = this.data.doctorList[index];
    if (!doctor) return;
    this.setData({
      selectedDoctorIndex: index,
      selectedDoctorName: this.data.doctorNames[index] || doctor.name || '医生',
      'formData.doctorId': doctor.id
    });
  },

  chooseFile() {
    const that = this;
    wx.showActionSheet({
      itemList: ['选择图片', '选择文件'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            success: (r) => {
              if (r.tempFiles && r.tempFiles[0]) {
                that.uploadFile(r.tempFiles[0].tempFilePath, r.tempFiles[0].tempFilePath.split('/').pop());
              }
            }
          });
        } else {
          wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success: (r) => {
              if (r.tempFiles && r.tempFiles[0]) {
                that.uploadFile(r.tempFiles[0].path, r.tempFiles[0].name);
              }
            }
          });
        }
      }
    });
  },

  uploadFile(tempPath, name) {
    wx.showLoading({ title: '上传中...' });
    wx.uploadFile({
      url: `${app.globalData.baseUrl}/files/upload`,
      filePath: tempPath,
      name: 'file',
      success: (res) => {
        try {
          const data = JSON.parse(res.data || '{}');
          if (data.code === 200) {
            const url = this.normalizeFileUrl(data.data);
            this.setData({
              'formData.fileUrl': url,
              fileName: name || '已选择文件'
            });
            wx.showToast({ title: '上传成功', icon: 'success' });
          } else {
            wx.showToast({ title: data.message || '上传失败', icon: 'none' });
          }
        } catch (e) {
          wx.showToast({ title: '上传失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '上传失败', icon: 'none' });
      },
      complete: () => {
        try { wx.hideLoading(); } catch(e) {}
      }
    });
  },

  submit() {
    if (!this.data.patientId) {
      wx.showToast({ title: '缺少患者信息', icon: 'none' });
      return;
    }
    if (!this.data.formData.doctorId) {
      wx.showToast({ title: '请选择医生', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '提交中...' });
    const { doctorId, ...restForm } = this.data.formData;
    const payload = {
      patientId: this.data.patientId,
      doctorId,
      ...restForm
    };
    app.request({
      url: '/medical-records/create',
      method: 'POST',
      data: payload
    }).then(() => {
      wx.showToast({ title: '创建成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    }).catch(err => {
      wx.showToast({ title: err.message || '创建失败', icon: 'none' });
    }).finally(() => {
      try { wx.hideLoading(); } catch(e) {}
    });
  },

  normalizeFileUrl(url) {
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


