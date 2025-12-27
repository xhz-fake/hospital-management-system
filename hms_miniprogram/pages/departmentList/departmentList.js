// pages/departmentList/departmentList.js
const app = getApp();

Page({
  data: {
    searchKeyword: '',
    departments: [
      { id: 1, name: '超声科' },
      { id: 2, name: '病理科' }
    ],
    filteredDepartments: [],
    selectedDepartmentId: null
  },

  onLoad() {
    this.setData({
      filteredDepartments: this.data.departments
    });
    this.loadDepartments();
  },

  // 加载科室列表
  loadDepartments() {
    app.request({
      url: '/departments/list',
      method: 'GET'
    }).then(res => {
      this.setData({
        departments: res || this.data.departments,
        filteredDepartments: res || this.data.departments
      });
    }).catch(err => {
      console.error('加载科室失败', err);
    });
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    const filtered = this.data.departments.filter(dept => 
      dept.name.includes(keyword)
    );
    this.setData({
      searchKeyword: keyword,
      filteredDepartments: filtered
    });
  },

  // 选择科室
  selectDepartment(e) {
    const department = e.currentTarget.dataset.department;
    this.setData({
      selectedDepartmentId: department.id
    });
    
    // 根据科室ID跳转到对应的医生列表页
    if (department.id === 1) {
      // 超声科
      wx.navigateTo({
        url: '/pages/doctorList/doctorList?departmentId=1&departmentName=超声科'
      });
    } else if (department.id === 2) {
      // 病理科
      wx.navigateTo({
        url: '/pages/pathologyDoctorList/pathologyDoctorList?departmentId=2&departmentName=病理科'
      });
    }
  }
});

