<template>
  <div class="dashboard">
    <!-- 数据概览 -->
    <el-row :gutter="20" class="overview">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon today">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.todayCount }}</div>
              <div class="stat-label">今日预约</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon completed">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.completedCount }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon pending">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.pendingCount }}</div>
              <div class="stat-label">待处理</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalCount }}</div>
              <div class="stat-label">总预约数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 今日预约列表 -->
    <el-card class="appointment-card">
      <template #header>
        <div class="card-header">
          <span>今日预约</span>
          <el-button type="primary" size="small" @click="refreshTodayAppointments">
            刷新
          </el-button>
        </div>
      </template>
      <el-table :data="todayAppointments" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNumber" label="挂号单号" width="180" />
        <el-table-column label="患者信息" width="150">
          <template #default="scope">
            <span>{{ scope.row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="appointmentTime" label="预约时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.appointmentTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="timeSlot" label="时间段" width="120" />
        <el-table-column prop="symptomDescription" label="症状描述" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="success"
              size="small"
              @click="updateStatus(scope.row.id, 1)"
            >
              完成就诊
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="warning"
              size="small"
              @click="updateStatus(scope.row.id, 3)"
            >
              取消预约
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { appointmentApi } from '@/api/appointment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, CircleCheck, Clock, User } from '@element-plus/icons-vue'

const userStore = useUserStore()
const loading = ref(false)
const todayAppointments = ref([])

const statistics = computed(() => {
  const today = todayAppointments.value.length
  const completed = todayAppointments.value.filter(a => a.status === 1).length
  const pending = todayAppointments.value.filter(a => a.status === 0).length
  return {
    todayCount: today,
    completedCount: completed,
    pendingCount: pending,
    totalCount: today
  }
})

onMounted(() => {
  loadTodayAppointments()
})

const loadTodayAppointments = async () => {
  if (!userStore.doctor?.id) return
  
  loading.value = true
  try {
    const data = await appointmentApi.getTodayAppointments(userStore.doctor.id)
    todayAppointments.value = data || []
  } catch (error) {
    ElMessage.error('加载预约列表失败')
  } finally {
    loading.value = false
  }
}

const refreshTodayAppointments = () => {
  loadTodayAppointments()
}

const updateStatus = async (id, status) => {
  const statusText = status === 1 ? '完成就诊' : '取消预约'
  try {
    await ElMessageBox.confirm(`确定要${statusText}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await appointmentApi.updateStatus(id, status)
    ElMessage.success(`${statusText}成功`)
    loadTodayAppointments()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${statusText}失败`)
    }
  }
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status) => {
  const statusMap = {
    0: '待就诊',
    1: '已就诊',
    2: '个人取消',
    3: '医生取消'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'danger'
  }
  return typeMap[status] || ''
}
</script>

<style lang="scss" scoped>
.dashboard {
  .overview {
    margin-bottom: 20px;
  }

  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #fff;

      &.today {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.completed {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.pending {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.total {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .stat-info {
      flex: 1;

      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        line-height: 1;
        margin-bottom: 10px;
      }

      .stat-label {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .appointment-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

