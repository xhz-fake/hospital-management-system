<template>
  <div class="appointments">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>预约管理</span>
          <div>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            />
          </div>
        </div>
      </template>
      <el-table :data="appointments" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNumber" label="挂号单号" width="180" />
        <el-table-column label="患者" width="120">
          <template #default="scope">
            {{ scope.row.patientName || '未知' }}
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
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { appointmentApi } from '@/api/appointment'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const loading = ref(false)
const appointments = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dateRange = ref([])

onMounted(() => {
  loadAppointments()
})

const loadAppointments = async () => {
  if (!userStore.doctor?.id) return
  
  loading.value = true
  try {
    // 这里可以根据实际需求调整API
    const data = await appointmentApi.getTodayAppointments(userStore.doctor.id)
    appointments.value = data || []
    total.value = appointments.value.length
  } catch (error) {
    ElMessage.error('加载预约列表失败')
  } finally {
    loading.value = false
  }
}

const handleDateChange = () => {
  loadAppointments()
}

const handleSizeChange = () => {
  loadAppointments()
}

const handlePageChange = () => {
  loadAppointments()
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
    loadAppointments()
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
.appointments {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

