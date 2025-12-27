import api from './index'

export const scheduleApi = {
  // 获取医生排班
  getSchedules(doctorId, startDate, endDate) {
    return api.get(`/schedules/doctor/${doctorId}`, {
      params: { startDate, endDate }
    })
  }
}

