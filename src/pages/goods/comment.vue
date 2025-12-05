<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 搜索/刷新 -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称或用户昵称" clearable style="width: 240px;" />
          <el-button type="primary" size="small" class="ml-2" @click="getData">搜索</el-button>
        </div>
        <div>
          <el-button type="warning" size="small" @click="handleRefresh">刷新</el-button>
        </div>
      </div>

      <!-- 评论列表 -->
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="goods.name" label="商品名称" min-width="150" />
        <el-table-column prop="user.nickname" label="用户" min-width="120" />
        <el-table-column prop="content" label="评论内容" min-width="200" />
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '显示' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="评论时间" min-width="180" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-popconfirm title="是否要删除该评论？" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
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
    <el-dialog v-model="viewDialogVisible" title="评论详情" width="50%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="商品名称">{{ currentComment.goods?.name }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentComment.user?.nickname }}</el-descriptions-item>
        <el-descriptions-item label="评分">
          <el-rate v-model="currentComment.rating" disabled />
        </el-descriptions-item>
        <el-descriptions-item label="评论内容">{{ currentComment.content }}</el-descriptions-item>
        <el-descriptions-item label="评论时间">{{ currentComment.create_time }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentComment.status ? 'success' : 'danger'">{{ currentComment.status ? '显示' : '隐藏' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { toast } from '~/composables/util'

// 搜索表单
const searchForm = reactive({
  keyword: ''
})

// 表格数据
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 查看详情弹窗
const viewDialogVisible = ref(false)
const currentComment = ref({})

// 获取评论列表
const getData = () => {
  // 模拟获取数据
  const mockData = []
  for (let i = 1; i <= pageSize.value; i++) {
    const id = (currentPage.value - 1) * pageSize.value + i
    mockData.push({
      id: id,
      goods: {
        name: `商品${id}`
      },
      user: {
        nickname: `用户${id}`
      },
      rating: Math.floor(Math.random() * 5) + 1,
      content: `这是第${id}条评论内容，商品质量很好，物流也很快。`,
      create_time: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status: Math.random() > 0.2 ? 1 : 0
    })
  }
  
  tableData.value = mockData
  total.value = 100 // 模拟总数据量
}

// 刷新数据
const handleRefresh = () => {
  getData()
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  getData()
}

// 查看评论详情
const handleView = (row) => {
  currentComment.value = { ...row }
  viewDialogVisible.value = true
}

// 删除评论
const handleDelete = (id) => {
  toast('删除成功')
  getData()
}

// 初始化数据
onMounted(() => {
  getData()
})
</script>