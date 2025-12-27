import api from './index'

export const patientApi = {
  // 获取患者列表
  getPatients(params) {
    return api.get('/patients/list', { params })
  },

  // 获取患者详情
  getPatient(id) {
    return api.get(`/patients/${id}`)
  },

  // 更新患者信息
  updatePatient(id, data) {
    return api.put(`/patients/${id}`, data)
  },

  // 删除患者
  deletePatient(id) {
    return api.delete(`/patients/${id}`)
  }
}

