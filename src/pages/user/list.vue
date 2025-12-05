<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 搜索/新增/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-form :inline="true" :model="searchForm" class="flex items-center">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" size="small" @click="handleCreate">新增用户</el-button>
          <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
        </div>
      </div>

      <!-- 用户列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <el-image :src="scope.row.avatar" style="width: 50px; height: 50px;" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="150" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">{{ scope.row.gender === 1 ? '男' : '女' }}</template>
        </el-table-column>
        <el-table-column prop="level.name" label="等级" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="success" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否要删除该用户？" @confirm="handleDelete(scope.row.id)">
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
        <el-form-item label="用户名">
          <el-input v-model="form.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" />
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
  username: '',
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
const dialogTitle = ref('新增用户')
const isEdit = ref(false)

// 表单数据
const form = reactive({
  id: null,
  username: '',
  nickname: '',
  email: '',
  avatar: '',
  status: 1
})

// 获取用户列表
const getData = () => {
  // 模拟获取数据
  const mockData = []
  for (let i = 1; i <= 10; i++) {
    mockData.push({
      id: i,
      username: 'user' + i,
      nickname: '用户' + i,
      email: 'user' + i + '@example.com',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      status: Math.floor(Math.random() * 2),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleString()
    })
  }
  tableData.value = mockData
  total.value = 100
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
  searchForm.username = ''
  searchForm.status = ''
  currentPage.value = 1
  getData()
}

// 刷新数据
const handleRefresh = () => {
  getData()
}

// 新增用户
const handleCreate = () => {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  // 重置表单
  Object.assign(form, {
    id: null,
    username: '',
    nickname: '',
    email: '',
    avatar: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  // 填充表单数据
  Object.assign(form, row)
  dialogVisible.value = true
}

// 查看用户
const handleView = (row) => {
  dialogTitle.value = '查看用户'
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

// 删除用户
const handleDelete = (id) => {
  toast('删除成功')
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>