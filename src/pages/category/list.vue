<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="handleCreate">新增分类</el-button>
        <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
      </div>

      <!-- 分类列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="scope">
            <el-image :src="scope.row.icon" style="width: 50px; height: 50px;" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '显示' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否要删除该分类？" @confirm="handleDelete(scope.row.id)">
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
        <el-form-item label="分类名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="父级分类">
          <el-select v-model="form.parent_id" placeholder="请选择父级分类">
            <el-option label="顶级分类" :value="0" />
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" />
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { toast } from '~/composables/util'

const store = useStore()

// 表格数据
const tableData = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const isEdit = ref(false)

// 表单数据
const form = reactive({
  id: null,
  name: '',
  parent_id: 0,
  sort: 0,
  status: 1
})

// 分类选项
const categoryOptions = computed(() => {
  return store.state.categoryList.filter(item => item.parent_id === 0)
})

// 获取分类列表
const getData = () => {
  store.dispatch('getCategoryList').then(res => {
    tableData.value = store.state.categoryList
  })
}

// 刷新数据
const handleRefresh = () => {
  getData()
}

// 新增分类
const handleCreate = () => {
  dialogTitle.value = '新增分类'
  isEdit.value = false
  // 重置表单
  Object.assign(form, {
    id: null,
    name: '',
    parent_id: 0,
    sort: 0,
    status: 1
  })
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  dialogTitle.value = '编辑分类'
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

// 删除分类
const handleDelete = (id) => {
  toast('删除成功')
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>