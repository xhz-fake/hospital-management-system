// pages/pathologyDoctorList/pathologyDoctorList.js
// 与doctorList.js逻辑相同，只是departmentId为2
const app = getApp();

Page({
  data: {
    departmentId: 2,
    departmentName: '病理科',
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
    const deptId = options && options.departmentId ? Number(options.departmentId) : 2;
    const deptName = (options && options.departmentName) ? options.departmentName : '病理科';
    this.setData({
      departmentId: isNaN(deptId) ? 2 : deptId,
      departmentName: deptName
    });
    if (deptName) {
      wx.setNavigationBarTitle({ title: deptName });
    }
    this.loadDoctors();
  },

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

  showStatusFilter() {
    this.setData({ showStatusModal: true });
  },

  hideStatusFilter() {
    this.setData({ showStatusModal: false });
  },

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

  showTitleFilter() {
    this.setData({ showTitleModal: true });
  },

  hideTitleFilter() {
    this.setData({ showTitleModal: false });
  },

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

  goToDoctorDetail(e) {
    const doctor = e.currentTarget.dataset.doctor;
    wx.navigateTo({
      url: `/pages/doctorDetail/doctorDetail?doctorId=${doctor.id}&departmentName=病理科`
    });
  }
});

