<template>
  <div class="schedule">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>排班管理</span>
          <div>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="loadSchedules"
            />
          </div>
        </div>
      </template>
      <el-table :data="schedules" v-loading="loading" style="width: 100%">
        <el-table-column prop="workDate" label="日期" width="150">
          <template #default="scope">
            {{ formatDate(scope.row.workDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="timeSlot" label="时间段" width="120" />
        <el-table-column prop="availableCount" label="可预约数量" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { scheduleApi } from '@/api/schedule'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const loading = ref(false)
const schedules = ref([])
const dateRange = ref([])

onMounted(() => {
  // 默认查询未来14天
  const today = new Date()
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + 14)
  dateRange.value = [today, endDate]
  loadSchedules()
})

const loadSchedules = async () => {
  if (!userStore.doctor?.id || !dateRange.value || dateRange.value.length !== 2) return
  
  loading.value = true
  try {
    const startDate = formatDateString(dateRange.value[0])
    const endDate = formatDateString(dateRange.value[1])
    const data = await scheduleApi.getSchedules(userStore.doctor.id, startDate, endDate)
    schedules.value = data || []
  } catch (error) {
    ElMessage.error('加载排班信息失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

const formatDateString = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style lang="scss" scoped>
.schedule {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

