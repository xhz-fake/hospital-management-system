// pages/doctorList/doctorList.js
const app = getApp();

Page({
  data: {
    departmentId: null,
    departmentName: '',
    doctors: [],
    status: null,
    title: null,
    statusText: '全部状态',
    titleText: '全部职称',
    showStatusModal: false,
    showTitleModal: false,
    statusOptions: [
      { label: '全部状态', value: null },
      { label: '可咨询', value: 1 },
      { label: '不可咨询', value: 0 }
    ],
    titleOptions: [
      { label: '全部职称', value: null },
      { label: '主任医师', value: '主任医师' },
      { label: '副主任医师', value: '副主任医师' },
      { label: '主治医师', value: '主治医师' },
      { label: '医师', value: '医师' }
    ]
  },

  onLoad(options) {
    this.setData({
      departmentId: options.departmentId,
      departmentName: options.departmentName || '超声科'
    });
    this.loadDoctors();
  },

  // 加载医生列表
  loadDoctors() {
    const params = {
      current: 1,
      size: 20,
      departmentId: this.data.departmentId
    };
    if (this.data.status !== null) {
      params.status = this.data.status;
    }
    if (this.data.title) {
      params.title = this.data.title;
    }

    app.request({
      url: '/doctors/list',
      method: 'GET',
      data: params
    }).then(res => {
      this.setData({
        doctors: res.records || []
      });
    }).catch(err => {
      console.error('加载医生列表失败', err);
    });
  },

  // 显示状态筛选
  showStatusFilter() {
    this.setData({
      showStatusModal: true
    });
  },

  // 隐藏状态筛选
  hideStatusFilter() {
    this.setData({
      showStatusModal: false
    });
  },

  // 选择状态
  selectStatus(e) {
    const status = e.currentTarget.dataset.status;
    const statusText = this.data.statusOptions.find(item => item.value === status)?.label || '全部状态';
    this.setData({
      status: status,
      statusText: statusText,
      showStatusModal: false
    });
    this.loadDoctors();
  },

  // 显示职称筛选
  showTitleFilter() {
    this.setData({
      showTitleModal: true
    });
  },

  // 隐藏职称筛选
  hideTitleFilter() {
    this.setData({
      showTitleModal: false
    });
  },

  // 选择职称
  selectTitle(e) {
    const title = e.currentTarget.dataset.title;
    const titleText = this.data.titleOptions.find(item => item.value === title)?.label || '全部职称';
    this.setData({
      title: title,
      titleText: titleText,
      showTitleModal: false
    });
    this.loadDoctors();
  },

  // 阻止事件冒泡
  stopPropagation() {},

  // 跳转到医生详情
  goToDoctorDetail(e) {
    const doctor = e.currentTarget.dataset.doctor;
    wx.navigateTo({
      url: `/pages/doctorDetail/doctorDetail?doctorId=${doctor.id}&departmentName=${this.data.departmentName}`
    });
  }
});

