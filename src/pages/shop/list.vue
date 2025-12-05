<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 搜索/新增/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-form :inline="true" :model="searchForm" class="flex items-center">
          <el-form-item label="店铺名称">
            <el-input v-model="searchForm.name" placeholder="请输入店铺名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="店铺状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="营业中" value="1"></el-option>
              <el-option label="休息中" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" size="small" @click="handleCreate">新增店铺</el-button>
          <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
        </div>
      </div>

      <!-- 店铺列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="店铺名称" min-width="150" />
        <el-table-column prop="logo" label="店铺Logo" width="80">
          <template #default="scope">
            <el-image :src="scope.row.logo" style="width: 50px; height: 50px;" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="owner.nickname" label="店主" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'warning' : 'danger'">
              {{ scope.row.status === 1 ? '营业中' : scope.row.status === 0 ? '待审核' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="success" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否要删除该店铺？" @confirm="handleDelete(scope.row.id)">
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
        <el-form-item label="店铺名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="店主">
          <el-input v-model="form.owner" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
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
  name: '',
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
const dialogTitle = ref('新增店铺')
const isEdit = ref(false)

// 表单数据
const form = reactive({
  id: null,
  name: '',
  owner: '',
  phone: '',
  address: '',
  status: 1
})

// 获取店铺列表
const getData = () => {
  // 模拟获取数据
  const mockData = []
  for (let i = 1; i <= 10; i++) {
    mockData.push({
      id: i,
      name: '店铺' + i,
      owner: '店主' + i,
      phone: '138' + Math.floor(Math.random() * 100000000),
      address: '北京市朝阳区某某街道' + i + '号',
      status: Math.floor(Math.random() * 2),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleString()
    })
  }
  tableData.value = mockData
  total.value = 50
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

// 新增店铺
const handleCreate = () => {
  dialogTitle.value = '新增店铺'
  isEdit.value = false
  // 重置表单
  Object.assign(form, {
    id: null,
    name: '',
    owner: '',
    phone: '',
    address: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑店铺
const handleEdit = (row) => {
  dialogTitle.value = '编辑店铺'
  isEdit.value = true
  // 填充表单数据
  Object.assign(form, row)
  dialogVisible.value = true
}

// 查看店铺
const handleView = (row) => {
  dialogTitle.value = '查看店铺'
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

// 删除店铺
const handleDelete = (id) => {
  toast('删除成功')
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>