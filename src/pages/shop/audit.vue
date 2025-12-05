<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 搜索/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-form :inline="true" :model="searchForm" class="flex items-center">
          <el-form-item label="店铺名称">
            <el-input v-model="searchForm.name" placeholder="请输入店铺名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="已通过" value="1"></el-option>
              <el-option label="已拒绝" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
      </div>

      <!-- 审核列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="店铺名称" min-width="150" />
        <el-table-column prop="owner" label="申请人" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'warning' : 'danger'">
              {{ scope.row.status === 1 ? '已通过' : scope.row.status === 0 ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
            <template v-if="scope.row.status === 0">
              <el-button type="success" size="small" @click="handleApprove(scope.row)">通过</el-button>
              <el-button type="danger" size="small" @click="handleReject(scope.row)">拒绝</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex items-center justify-center mt-4">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="店铺详情" width="50%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="店铺名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="店主">{{ detailData.owner }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ detailData.address }}</el-descriptions-item>
        <el-descriptions-item label="营业执照">
          <el-image 
            v-if="detailData.license" 
            :src="detailData.license" 
            style="width: 100px; height: 100px;" 
            fit="cover"
          ></el-image>
          <span v-else>未上传</span>
        </el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag :type="getStatusType(detailData.status)">{{ getStatusText(detailData.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detailData.created_at }}</el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ detailData.processed_at || '未处理' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button v-if="detailData.status === '0'" type="success" @click="handleApprove(detailData)">通过</el-button>
          <el-button v-if="detailData.status === '0'" type="danger" @click="handleReject(detailData)">拒绝</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { toast } from '~/composables/util'

const store = useStore()

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref([])

// 详情弹窗相关
const detailDialogVisible = ref(false)
const detailData = ref({})

// 获取审核列表
const getData = () => {
  // 模拟获取数据
  const mockData = []
  for (let i = 1; i <= 10; i++) {
    mockData.push({
      id: i,
      name: '申请店铺' + i,
      owner: '申请人' + i,
      phone: '138' + Math.floor(Math.random() * 100000000),
      address: '北京市朝阳区某某街道' + i + '号',
      license: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      status: Math.floor(Math.random() * 3).toString(),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleString(),
      processed_at: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toLocaleString() : null
    })
  }
  tableData.value = mockData
  total.value = 30
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    '0': '待审核',
    '1': '已通过',
    '2': '已拒绝'
  }
  return statusMap[status] || '未知'
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '0': 'warning',
    '1': 'success',
    '2': 'danger'
  }
  return typeMap[status] || 'info'
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  getData()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = ''
  currentPage.value = 1
  getData()
}

// 刷新数据
const handleRefresh = () => {
  getData()
}

// 查看详情
const handleView = (row) => {
  detailData.value = row
  detailDialogVisible.value = true
}

// 通过审核
const handleApprove = (row) => {
  toast('已通过审核')
  detailDialogVisible.value = false
  getData()
}

// 拒绝审核
const handleReject = (row) => {
  toast('已拒绝审核')
  detailDialogVisible.value = false
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>