import api from './index'

export const medicalRecordApi = {
  // 按患者查询病历
  getByPatient(patientId) {
    return api.get(`/medical-records/patient/${patientId}`)
  },
  // 创建病历
  create(data) {
    return api.post('/medical-records/create', data)
  }
}


