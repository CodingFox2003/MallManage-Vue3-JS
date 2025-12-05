<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="handleCreate">新增管理员</el-button>
        <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
      </div>

      <!-- 管理员列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="avatar" label="头像">
          <template #default="scope">
            <el-image :src="scope.row.avatar" style="width: 50px; height: 50px;" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="role.name" label="角色" min-width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_at" label="最后登录时间" min-width="180" />
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否要删除该管理员？" @confirm="handleDelete(scope.row.id)">
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
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="超级管理员" />
            <el-option label="管理员" value="管理员" />
            <el-option label="运营人员" value="运营人员" />
            <el-option label="客服" value="客服" />
          </el-select>
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

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增管理员')
const isEdit = ref(false)

// 表单数据
const form = reactive({
  id: null,
  username: '',
  nickname: '',
  avatar: '',
  role: '',
  status: 1
})

// 获取管理员列表
const getData = () => {
  store.dispatch('getAdminList', currentPage.value).then(res => {
    tableData.value = store.state.adminList
    total.value = store.state.adminTotal
  })
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  getData()
}

// 刷新数据
const handleRefresh = () => {
  getData()
}

// 新增管理员
const handleCreate = () => {
  dialogTitle.value = '新增管理员'
  isEdit.value = false
  // 重置表单
  Object.assign(form, {
    id: null,
    username: '',
    nickname: '',
    avatar: '',
    role: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑管理员
const handleEdit = (row) => {
  dialogTitle.value = '编辑管理员'
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

// 删除管理员
const handleDelete = (id) => {
  toast('删除成功')
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>