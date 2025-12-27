import api from './index'

export const fileApi = {
  upload(formData) {
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}


