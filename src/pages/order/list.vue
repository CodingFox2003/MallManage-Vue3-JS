<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 搜索/新增/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-form :inline="true" :model="searchForm" class="flex items-center">
          <el-form-item label="订单号">
            <el-input v-model="searchForm.order_no" placeholder="请输入订单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="待付款" value="0"></el-option>
              <el-option label="待发货" value="1"></el-option>
              <el-option label="待收货" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
              <el-option label="已取消" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" size="small" @click="handleCreate">新增订单</el-button>
          <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
        </div>
      </div>

      <!-- 订单列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="order_no" label="订单号" width="180" />
        <el-table-column prop="user.nickname" label="用户" width="120" />
        <el-table-column prop="total_price" label="总金额" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="success" size="small" @click="handleEdit(scope.row)" :disabled="scope.row.status !== 0">编辑</el-button>
            <el-popconfirm title="是否要删除该订单？" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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

    <!-- 表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="订单号">
          <el-input v-model="form.order_no" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="用户">
          <el-select v-model="form.user_id" placeholder="请选择用户" :disabled="isEdit">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="总金额">
          <el-input-number v-model="form.total_price" :precision="2" :step="0.1" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="待付款" value="0"></el-option>
            <el-option label="待发货" value="1"></el-option>
            <el-option label="待收货" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
            <el-option label="已取消" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
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
  order_no: '',
  status: ''
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增订单')
const isEdit = ref(false)

// 用户列表
const userList = ref([
  { id: 1, nickname: '用户A' },
  { id: 2, nickname: '用户B' },
  { id: 3, nickname: '用户C' }
])

// 表单数据
const form = reactive({
  id: null,
  order_no: '',
  user_id: null,
  total_price: 0,
  status: '0'
})

// 获取订单列表
const getData = () => {
  // 模拟获取数据
  const mockData = []
  for (let i = 1; i <= 10; i++) {
    mockData.push({
      id: i,
      order_no: 'ORD' + Date.now() + i,
      user: { id: i, nickname: '用户' + String.fromCharCode(64 + i) },
      total_price: (Math.random() * 1000).toFixed(2),
      status: Math.floor(Math.random() * 5).toString(),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleString()
    })
  }
  tableData.value = mockData
  total.value = 50
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    '0': '待付款',
    '1': '待发货',
    '2': '待收货',
    '3': '已完成',
    '4': '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '0': 'info',
    '1': 'warning',
    '2': 'primary',
    '3': 'success',
    '4': 'danger'
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
  searchForm.order_no = ''
  searchForm.status = ''
  currentPage.value = 1
  getData()
}

// 刷新数据
const handleRefresh = () => {
  getData()
}

// 新增订单
const handleCreate = () => {
  dialogTitle.value = '新增订单'
  isEdit.value = false
  // 重置表单
  Object.assign(form, {
    id: null,
    order_no: 'ORD' + Date.now(),
    user_id: null,
    total_price: 0,
    status: '0'
  })
  dialogVisible.value = true
}

// 编辑订单
const handleEdit = (row) => {
  dialogTitle.value = '编辑订单'
  isEdit.value = true
  // 填充表单数据
  Object.assign(form, row)
  dialogVisible.value = true
}

// 查看订单
const handleView = (row) => {
  dialogTitle.value = '查看订单'
  isEdit.value = true
  // 填充表单数据
  Object.assign(form, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = () => {
  toast('操作成功')
  dialogVisible.value = false
  getData()
}

// 删除订单
const handleDelete = (id) => {
  toast('删除成功')
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>