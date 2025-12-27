import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const doctor = ref(null)
  const token = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  // 登录
  async function login(username, password) {
    try {
      const response = await api.post('/doctors/login', { username, password })
      doctor.value = response
      token.value = 'token_' + Date.now() // 简单token，实际项目中应使用JWT
      localStorage.setItem('doctor', JSON.stringify(doctor.value))
      localStorage.setItem('token', token.value)
      return response
    } catch (error) {
      throw error
    }
  }

  // 退出登录
  function logout() {
    doctor.value = null
    token.value = null
    localStorage.removeItem('doctor')
    localStorage.removeItem('token')
  }

  // 初始化用户信息
  function initUser() {
    const savedDoctor = localStorage.getItem('doctor')
    const savedToken = localStorage.getItem('token')
    if (savedDoctor && savedToken) {
      doctor.value = JSON.parse(savedDoctor)
      token.value = savedToken
    }
  }

  return {
    doctor,
    token,
    isLoggedIn,
    login,
    logout,
    initUser
  }
})

