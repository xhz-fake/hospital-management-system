<template>
  <div class="medical-records">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>病历管理</span>
          <div class="actions">
            <el-input v-model="patientId" placeholder="输入患者ID" style="width: 200px; margin-right: 12px;" />
            <el-button type="primary" @click="loadRecords">查询</el-button>
            <el-button type="success" @click="openCreate">新增病历</el-button>
          </div>
        </div>
      </template>
      <el-table :data="records" v-loading="loading" style="width: 100%">
        <el-table-column prop="patientName" label="患者姓名" width="120" />
        <el-table-column prop="diagnosis" label="诊断结果" show-overflow-tooltip />
        <el-table-column prop="treatment" label="治疗方案" show-overflow-tooltip />
        <el-table-column prop="createdTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createdTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewRecord(scope.row)">
              查看详情
            </el-button>
            <el-button v-if="scope.row.fileUrl" type="info" size="small" @click="previewFile(scope.row.fileUrl)">
              查看附件
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 病历详情对话框 -->
    <el-dialog v-model="dialogVisible" title="病历详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="患者姓名">{{ currentRecord.patientName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(currentRecord.createdTime) }}</el-descriptions-item>
        <el-descriptions-item label="诊断结果" :span="2">{{ currentRecord.diagnosis }}</el-descriptions-item>
        <el-descriptions-item label="治疗方案" :span="2">{{ currentRecord.treatment }}</el-descriptions-item>
        <el-descriptions-item label="处方" :span="2">{{ currentRecord.prescription }}</el-descriptions-item>
        <el-descriptions-item label="病历内容" :span="2">{{ currentRecord.recordContent }}</el-descriptions-item>
        <el-descriptions-item v-if="currentRecord.fileUrl" label="附件" :span="2">
          <a :href="currentRecord.fileUrl" target="_blank">{{ currentRecord.fileUrl }}</a>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 新增病历对话框 -->
    <el-dialog v-model="createVisible" title="新增病历" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="患者ID">
          <el-input v-model="form.patientId" placeholder="患者ID" />
        </el-form-item>
        <el-form-item label="诊断结果">
          <el-input v-model="form.diagnosis" type="textarea" />
        </el-form-item>
        <el-form-item label="治疗方案">
          <el-input v-model="form.treatment" type="textarea" />
        </el-form-item>
        <el-form-item label="处方">
          <el-input v-model="form.prescription" type="textarea" />
        </el-form-item>
        <el-form-item label="病历内容">
          <el-input v-model="form.recordContent" type="textarea" />
        </el-form-item>
        <el-form-item label="附件上传">
          <input ref="fileInput" type="file" @change="onFileChange" />
          <div v-if="form.fileUrl" style="margin-top:8px;">
            已上传：<a :href="form.fileUrl" target="_blank">{{ form.fileUrl }}</a>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { medicalRecordApi } from '@/api/medicalRecord'
import { fileApi } from '@/api/file'
import { useUserStore } from '@/stores/user'

const loading = ref(false)
const records = ref([])
const dialogVisible = ref(false)
const currentRecord = ref({})
const createVisible = ref(false)
const form = ref({
  patientId: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  recordContent: '',
  fileUrl: '',
  doctorId: ''
})
const fileInput = ref(null)
const patientId = ref('')
const userStore = useUserStore()
userStore.initUser()
const currentDoctor = computed(() => userStore.doctor)

onMounted(() => {
  loadRecords()
})

const resolveFileUrl = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const apiPrefix = '/api'
  const path = url.startsWith('/api/') ? url : `${apiPrefix}${url.startsWith('/') ? url : `/${url}`}`
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}${path}`
  }
  return path
}

const loadRecords = async () => {
  if (!patientId.value) {
    records.value = []
    return
  }
  loading.value = true
  try {
    const data = await medicalRecordApi.getByPatient(patientId.value)
    records.value = (data || []).map(item => ({
      ...item,
      fileUrl: resolveFileUrl(item.fileUrl)
    }))
  } catch (e) {
    ElMessage.error('加载病历失败')
  } finally {
    loading.value = false
  }
}

const viewRecord = (record) => {
  currentRecord.value = record
  dialogVisible.value = true
}

const openCreate = () => {
  form.value = {
    patientId: patientId.value || '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    recordContent: '',
    fileUrl: '',
    doctorId: currentDoctor.value?.id || ''
  }
  createVisible.value = true
}

const onFileChange = async (e) => {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  const fd = new FormData()
  fd.append('file', f)
  try {
    const url = await fileApi.upload(fd)
    form.value.fileUrl = url
    ElMessage.success('上传成功')
  } catch (e) {
    ElMessage.error('上传失败')
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

const submitCreate = async () => {
  if (!form.value.patientId) {
    ElMessage.warning('请填写患者ID')
    return
  }
  if (!currentDoctor.value?.id) {
    ElMessage.error('请重新登录医生账号')
    return
  }
  try {
    await medicalRecordApi.create({
      ...form.value,
      doctorId: currentDoctor.value.id
    })
    ElMessage.success('创建成功')
    createVisible.value = false
    loadRecords()
  } catch (e) {
    ElMessage.error('创建失败')
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

const previewFile = (url) => {
  if (!url) return
  const finalUrl = resolveFileUrl(url)
  window.open(finalUrl, '_blank')
}
</script>

<style lang="scss" scoped>
.medical-records {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

