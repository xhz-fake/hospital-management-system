<template>
  <el-container class="main-layout">
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <h2>医院管理系统</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#0b988f"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Grid /></el-icon>
          <span>工作台</span>
        </el-menu-item>
        <el-menu-item index="/appointments">
          <el-icon><Calendar /></el-icon>
          <span>预约管理</span>
        </el-menu-item>
        <el-menu-item index="/patients">
          <el-icon><User /></el-icon>
          <span>患者管理</span>
        </el-menu-item>
        <el-menu-item index="/schedule">
          <el-icon><Clock /></el-icon>
          <span>排班管理</span>
        </el-menu-item>
        <el-menu-item index="/medical-records">
          <el-icon><Document /></el-icon>
          <span>病历管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h3>{{ pageTitle }}</h3>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="40" :src="userStore.doctor?.avatarUrl">
                <!-- 医生头像图片位置，建议图片尺寸：40x40 -->
              </el-avatar>
              <span class="doctor-name">{{ userStore.doctor?.name || '医生' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import { Grid, Calendar, User, Clock, Document, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
const pageTitle = computed(() => route.meta.title || '工作台')

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/login')
    }).catch(() => {})
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
}

.sidebar {
  background-color: #0b988f;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #0a7d75;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 20px;

  .header-left h3 {
    margin: 0;
    color: #333;
  }

  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 10px;

    .doctor-name {
      font-weight: 500;
    }
  }
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>

