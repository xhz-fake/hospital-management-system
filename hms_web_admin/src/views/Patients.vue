<template>
  <div class="patients">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>患者管理</span>
          <el-input
            v-model="keyword"
            placeholder="搜索患者姓名/手机号/身份证号"
            style="width: 300px"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>
      <el-table :data="patients" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            {{ scope.row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="residence" label="居住地" show-overflow-tooltip />
        <el-table-column prop="createdTime" label="建档时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createdTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewPatient(scope.row)">
              查看详情
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

    <!-- 患者详情对话框 -->
    <el-dialog v-model="dialogVisible" title="患者详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ currentPatient.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentPatient.gender === 1 ? '男' : '女' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentPatient.age }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentPatient.phone }}</el-descriptions-item>
        <el-descriptions-item label="身份证号" :span="2">{{ currentPatient.idCard }}</el-descriptions-item>
        <el-descriptions-item label="居住地">{{ currentPatient.residence }}</el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="2">{{ currentPatient.address }}</el-descriptions-item>
        <el-descriptions-item label="建档时间" :span="2">{{ formatDateTime(currentPatient.createdTime) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { patientApi } from '@/api/patient'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const loading = ref(false)
const patients = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')
const dialogVisible = ref(false)
const currentPatient = ref({})

onMounted(() => {
  loadPatients()
})

const loadPatients = async () => {
  loading.value = true
  try {
    const data = await patientApi.getPatients({
      current: currentPage.value,
      size: pageSize.value,
      keyword: keyword.value
    })
    patients.value = data.records || []
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('加载患者列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadPatients()
}

const handleSizeChange = () => {
  loadPatients()
}

const handlePageChange = () => {
  loadPatients()
}

const viewPatient = (patient) => {
  currentPatient.value = patient
  dialogVisible.value = true
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
</script>

<style lang="scss" scoped>
.patients {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

