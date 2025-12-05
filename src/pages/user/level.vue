<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <div></div>
        <div>
          <el-button type="primary" size="small" @click="handleCreate">新增等级</el-button>
          <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
        </div>
      </div>

      <!-- 等级列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="等级名称" min-width="150" />
        <el-table-column prop="level" label="等级" width="80" />
        <el-table-column prop="min_score" label="最低积分" width="100" />
        <el-table-column prop="discount" label="折扣率" width="80">
          <template #default="scope">{{ scope.row.discount }}%</template>
        </el-table-column>
        <el-table-column prop="description" label="等级描述" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否要删除该等级？" @confirm="handleDelete(scope.row.id)">
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
        <el-form-item label="等级名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="等级">
          <el-input-number v-model="form.level" :min="1" />
        </el-form-item>
        <el-form-item label="最低积分">
          <el-input-number v-model="form.min_score" :min="0" />
        </el-form-item>
        <el-form-item label="折扣率(%)">
          <el-input-number v-model="form.discount" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="等级描述">
          <el-input v-model="form.description" type="textarea" />
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

// 表格数据
const tableData = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增等级')
const isEdit = ref(false)

// 表单数据
const form = reactive({
  id: null,
  name: '',
  level: 1,
  min_score: 0,
  discount: 100,
  description: '',
  status: 1
})

// 获取等级列表
const getData = () => {
  // 模拟获取数据
  const mockData = [
    {
      id: 1,
      name: '普通会员',
      level: 1,
      min_score: 0,
      discount: 100,
      description: '普通会员享受基础服务',
      status: 1
    },
    {
      id: 2,
      name: '银牌会员',
      level: 2,
      min_score: 1000,
      discount: 95,
      description: '银牌会员享受95折优惠',
      status: 1
    },
    {
      id: 3,
      name: '金牌会员',
      level: 3,
      min_score: 5000,
      discount: 90,
      description: '金牌会员享受9折优惠',
      status: 1
    },
    {
      id: 4,
      name: '钻石会员',
      level: 4,
      min_score: 10000,
      discount: 85,
      description: '钻石会员享受85折优惠',
      status: 1
    }
  ]
  tableData.value = mockData
}

// 刷新数据
const handleRefresh = () => {
  getData()
}

// 新增等级
const handleCreate = () => {
  dialogTitle.value = '新增等级'
  isEdit.value = false
  // 重置表单
  Object.assign(form, {
    id: null,
    name: '',
    level: 1,
    min_score: 0,
    discount: 100,
    description: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑等级
const handleEdit = (row) => {
  dialogTitle.value = '编辑等级'
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

// 删除等级
const handleDelete = (id) => {
  toast('删除成功')
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>