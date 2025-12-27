<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo">
        <h1>华为大学总医院</h1>
        <p>医生管理系统</p>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="tips">
        <p>测试账号：doctor1 - doctor10</p>
        <p>密码：123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm.value.username, loginForm.value.password)
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0b988f 0%, #0a7d75 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 400px;
  background-color: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    color: #0b988f;
    font-size: 28px;
    margin: 0 0 10px 0;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

.login-form {
  .login-button {
    width: 100%;
    background-color: #0b988f;
    border: none;
    height: 45px;
    font-size: 16px;
  }

  .login-button:hover {
    background-color: #0a7d75;
  }
}

.tips {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;

  p {
    margin: 5px 0;
    font-size: 12px;
    color: #999;
  }
}
</style>

