import api from './index'

export const doctorApi = {
  // 医生登录
  login(username, password) {
    return api.post('/doctors/login', { username, password })
  },

  // 获取医生信息
  getDoctor(id) {
    return api.get(`/doctors/${id}`)
  },

  // 获取医生列表
  getDoctors(params) {
    return api.get('/doctors/list', { params })
  }
}

