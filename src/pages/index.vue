<template>
	<div class="container">
		<el-card class="mb-4">
			<template #header>
				<div class="flex items-center">
					<span class="text-lg font-bold">欢迎使用商城后台管理系统</span>
				</div>
			</template>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-gray-600">欢迎你，{{ $store.state.user.nickname }}</p>
					<p class="text-gray-500 text-sm mt-2">今日天气晴朗，心情美丽</p>
				</div>
				<div class="text-right">
					<p class="text-gray-500">当前时间</p>
					<p class="text-lg">{{ currentTime }}</p>
				</div>
			</div>
		</el-card>

		<el-row :gutter="20">
			<el-col :span="6">
				<el-card shadow="hover" class="text-center">
					<div class="text-blue-500 text-3xl mb-2">
						<i class="el-icon-user"></i>
					</div>
					<div class="text-gray-500 text-sm">用户总数</div>
					<div class="text-2xl font-bold">12,345</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover" class="text-center">
					<div class="text-green-500 text-3xl mb-2">
						<i class="el-icon-shopping-cart-full"></i>
					</div>
					<div class="text-gray-500 text-sm">商品总数</div>
					<div class="text-2xl font-bold">5,678</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover" class="text-center">
					<div class="text-yellow-500 text-3xl mb-2">
						<i class="el-icon-tickets"></i>
					</div>
					<div class="text-gray-500 text-sm">订单总数</div>
					<div class="text-2xl font-bold">9,876</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover" class="text-center">
					<div class="text-red-500 text-3xl mb-2">
						<i class="el-icon-bank-card"></i>
					</div>
					<div class="text-gray-500 text-sm">今日销售额</div>
					<div class="text-2xl font-bold">¥123,456</div>
				</el-card>
			</el-col>
		</el-row>

		<el-row :gutter="20" class="mt-4">
			<el-col :span="24">
				<el-card shadow="never" class="border-0">
					<template #header>
						<div class="flex items-center justify-between">
							<span>最新订单</span>
						</div>
					</template>
					<el-table :data="latestOrders" border stripe>
						<el-table-column prop="id" label="订单号" />
						<el-table-column prop="user" label="用户" />
						<el-table-column prop="amount" label="金额" />
						<el-table-column prop="status" label="状态">
							<template #default="scope">
								<el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20" class="mt-4">
			<el-col :span="24">
				<el-card shadow="never" class="border-0">
					<template #header>
						<div class="flex items-center justify-between">
							<span>热门商品</span>
						</div>
					</template>
					<el-table :data="tableData" border stripe style="width: 100%;">
						<el-table-column prop="id" label="ID" width="80" />
						<el-table-column prop="name" label="商品名称" min-width="150" />
						<el-table-column prop="sales" label="销量" width="100" />
						<el-table-column prop="price" label="价格" width="100" />
					</el-table>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20" class="mt-4">
			<el-col :span="24">
				<el-card shadow="never" class="border-0">
					<template #header>
						<div class="flex items-center justify-between">
							<span>系统信息</span>
						</div>
					</template>
					<el-descriptions :column="1" border>
						<el-descriptions-item label="操作系统">Windows 11</el-descriptions-item>
						<el-descriptions-item label="Node版本">v16.14.0</el-descriptions-item>
						<el-descriptions-item label="Vue版本">3.2.37</el-descriptions-item>
						<el-descriptions-item label="Element Plus版本">2.2.12</el-descriptions-item>
						<el-descriptions-item label="服务器时间">{{ currentTime }}</el-descriptions-item>
					</el-descriptions>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 当前时间
const currentTime = ref(new Date().toLocaleString())

// 定时器
let timer = null

// 最新订单数据
const latestOrders = ref([
  { id: '20230520001', user: '张三', amount: '¥299.00', status: '已完成' },
  { id: '20230520002', user: '李四', amount: '¥1599.00', status: '待发货' },
  { id: '20230520003', user: '王五', amount: '¥89.00', status: '已取消' },
  { id: '20230520004', user: '赵六', amount: '¥399.00', status: '待付款' },
  { id: '20230520005', user: '钱七', amount: '¥599.00', status: '已完成' }
])

// 热门商品数据
const hotGoods = ref([
  { id: 1, name: 'iPhone 14 Pro', sales: 1234, price: '¥7999.00' },
  { id: 2, name: 'MacBook Air M2', sales: 892, price: '¥9499.00' },
  { id: 3, name: 'AirPods Pro', sales: 2543, price: '¥1899.00' },
  { id: 4, name: 'iPad Pro', sales: 765, price: '¥6199.00' },
  { id: 5, name: 'Apple Watch Series 8', sales: 1876, price: '¥2999.00' }
])

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '待发货':
      return 'warning'
    case '待付款':
      return 'info'
    case '已取消':
      return 'danger'
    default:
      return 'info'
  }
}

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

// 初始化
onMounted(() => {
  // 每秒更新一次时间
  timer = setInterval(updateTime, 1000)
})

// 清理定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mt-4 {
  margin-top: 1rem;
}
/* 确保所有卡片宽度一致 */
.el-row {
  width: 100%;
}
.el-card {
  width: 100%;
}
</style>