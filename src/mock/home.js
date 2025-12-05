// 引入Mock.js
import Mock from 'mockjs'

// 模拟首页统计数据
const statistics = {
  userCount: 12345,
  goodsCount: 5678,
  orderCount: 9876,
  todaySales: 123456
}

// 模拟最新订单数据
const latestOrders = Mock.mock({
  'list|5': [{
    'id|+1': 1,
    'order_no': '@guid',
    'user': '@cname',
    'amount|100-5000.2': 1,
    'status': '@pick(["待付款", "待发货", "待收货", "已完成", "已取消"])'
  }]
})

// 模拟热门商品数据
const hotGoods = Mock.mock({
  'list|5': [{
    'id|+1': 1,
    'name': '@ctitle(5,10)',
    'sales|100-2000': 1,
    'price|10-1000.2': 1
  }]
})

export default function() {
  // 首页统计数据接口
  Mock.mock('/api/home/statistics', 'get', () => {
    return {
      code: 200,
      msg: '获取成功',
      data: statistics
    }
  })

  // 最新订单列表接口
  Mock.mock('/api/home/latest-orders', 'get', () => {
    return {
      code: 200,
      msg: '获取成功',
      data: latestOrders
    }
  })

  // 热门商品列表接口
  Mock.mock('/api/home/hot-goods', 'get', () => {
    return {
      code: 200,
      msg: '获取成功',
      data: hotGoods
    }
  })

  // 销售趋势数据接口
  Mock.mock('/api/home/salesTrend', 'get', () => {
    // 模拟最近30天的销售数据
    const salesData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      salesData.push({
        date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
        amount: Mock.Random.integer(1000, 10000)
      })
    }
    
    return {
      code: 200,
      msg: '获取成功',
      data: salesData
    }
  })
  // 商品分类销售数据接口
  Mock.mock('/api/home/categorySales', 'get', () => {
    return {
      code: 200,
      msg: '获取成功',
      data: statistics
    }
  })

  // 热销商品排行接口
  Mock.mock('/api/home/hotGoods', 'get', () => {
    return {
      code: 200,
      msg: '获取成功',
      data: statistics
    }
  })

  // 最新订单接口
  Mock.mock('/api/home/latestOrders', 'get', () => {
    return {
      code: 200,
      msg: '获取成功',
      data: latestOrders
    }
  })
}