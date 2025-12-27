import api from './index'

export const appointmentApi = {
  // 获取患者预约列表
  getPatientAppointments(patientId, params) {
    return api.get(`/appointments/patient/${patientId}`, { params })
  },

  // 获取医生今日预约
  getTodayAppointments(doctorId) {
    return api.get(`/appointments/doctor/${doctorId}/today`)
  },

  // 更新预约状态
  updateStatus(id, status) {
    return api.put(`/appointments/${id}/status`, null, { params: { status } })
  },

  // 获取预约详情
  getAppointment(id) {
    return api.get(`/appointments/${id}`)
  }
}

