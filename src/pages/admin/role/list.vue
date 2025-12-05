<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="handleCreate">新增角色</el-button>
        <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
      </div>

      <!-- 角色列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否要删除该角色？" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.desc" type="textarea" />
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

// 模拟角色数据
const roles = [
  {
    id: 1,
    name: '超级管理员',
    desc: '拥有系统最高权限',
    status: 1,
    created_at: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    name: '管理员',
    desc: '普通管理员权限',
    status: 1,
    created_at: '2023-01-01 12:00:00'
  },
  {
    id: 3,
    name: '运营人员',
    desc: '负责商品运营管理',
    status: 1,
    created_at: '2023-01-01 12:00:00'
  },
  {
    id: 4,
    name: '客服',
    desc: '负责客户服务',
    status: 1,
    created_at: '2023-01-01 12:00:00'
  }
]

// 表格数据
const tableData = ref(roles)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const isEdit = ref(false)

// 表单数据
const form = reactive({
  id: null,
  name: '',
  desc: '',
  status: 1
})

// 刷新数据
const handleRefresh = () => {
  tableData.value = [...roles]
}

// 新增角色
const handleCreate = () => {
  dialogTitle.value = '新增角色'
  isEdit.value = false
  // 重置表单
  Object.assign(form, {
    id: null,
    name: '',
    desc: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  dialogTitle.value = '编辑角色'
  isEdit.value = true
  // 填充表单数据
  Object.assign(form, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = () => {
  toast('操作成功')
  dialogVisible.value = false
  handleRefresh()
}

// 删除角色
const handleDelete = (id) => {
  toast('删除成功')
  handleRefresh()
}

// 初始化数据
onMounted(() => {
  handleRefresh()
})
</script>