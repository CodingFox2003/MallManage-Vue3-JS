import Mock from 'mockjs'

// 模拟订单数据
const orders = Mock.mock({
  'list|100': [{
    'id|+1': 1,
    'order_no': '@guid',
    'user_id|1-100': 1,
    'user': {
      'nickname': '@cname',
      'avatar': '@image("100x100")'
    },
    'goods|1-5': [{
      'id|+1': 1,
      'name': '@ctitle(5,10)',
      'cover': '@image("100x100")',
      'price|10-1000.2': 1,
      'num|1-10': 1
    }],
    'amount|10-5000.2': 1,
    'freight|0-50.2': 1,
    'coupon|0-50.2': 1,
    'actual_amount|10-5000.2': 1,
    'status|1-5': 1, // 1:待付款 2:待发货 3:待收货 4:已完成 5:已取消
    'payment_method|1-4': 1, // 1:支付宝 2:微信 3:银行卡 4:余额
    'receiver_name': '@cname',
    'receiver_phone': /^1[3-9]\d{9}$/,
    'receiver_address': '@county(true) @cword(3,8) @natural(1,20)号',
    'create_time': '@datetime',
    'payment_time': '@datetime',
    'delivery_time': '@datetime',
    'complete_time': '@datetime'
  }]
})

// 模拟退款申请数据
const refunds = Mock.mock({
  'list|30': [{
    'id|+1': 1,
    'order_id|1-100': 1,
    'order_no': '@guid',
    'user_id|1-100': 1,
    'user': {
      'nickname': '@cname',
      'avatar': '@image("100x100")'
    },
    'goods': {
      'id|1-100': 1,
      'name': '@ctitle(5,10)',
      'cover': '@image("100x100")',
      'price|10-1000.2': 1
    },
    'refund_amount|10-1000.2': 1,
    'refund_reason': '@cparagraph(1)',
    'refund_explain': '@cparagraph(2)',
    'images|0-3': ['@image("200x200")'],
    'status|1-3': 1, // 1:待处理 2:已同意 3:已拒绝
    'apply_time': '@datetime',
    'process_time': '@datetime'
  }]
})

export default function() {
  // 订单列表接口
  Mock.mock('/api/order/list', 'get', ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const page = parseInt(params.get('page')) || 1
    const limit = parseInt(params.get('limit')) || 10
    const keyword = params.get('keyword') || ''
    
    let filteredList = orders.list
    
    // 根据关键词筛选
    if (keyword) {
      filteredList = filteredList.filter(item => 
        item.order_no.includes(keyword) || 
        item.user.nickname.includes(keyword) ||
        item.receiver_name.includes(keyword) ||
        item.receiver_phone.includes(keyword)
      )
    }
    
    // 分页处理
    const start = (page - 1) * limit
    const end = page * limit
    const paginatedList = filteredList.slice(start, end)
    
    return {
      code: 200,
      msg: '获取成功',
      data: {
        list: paginatedList,
        total: filteredList.length
      }
    }
  })

  // 订单详情接口
  Mock.mock(/^\/api\/order\/detail/, 'get', ({ url }) => {
    const id = url.match(/\/api\/order\/detail\/(\d+)/)[1]
    const order = orders.list.find(item => item.id == id)
    
    if (order) {
      return {
        code: 200,
        msg: '获取成功',
        data: order
      }
    } else {
      return {
        code: 404,
        msg: '订单不存在',
        data: null
      }
    }
  })

  // 修改订单状态接口
  Mock.mock('/api/order/update_status', 'post', ({ body }) => {
    const { id, status } = JSON.parse(body)
    const order = orders.list.find(item => item.id == id)
    
    if (order) {
      order.status = status
      return {
        code: 200,
        msg: '操作成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '订单不存在',
        data: null
      }
    }
  })

  // 退款申请列表接口
  Mock.mock('/api/refund/list', 'get', ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const page = parseInt(params.get('page')) || 1
    const limit = parseInt(params.get('limit')) || 10
    const keyword = params.get('keyword') || ''
    
    let filteredList = refunds.list
    
    // 根据关键词筛选
    if (keyword) {
      filteredList = filteredList.filter(item => 
        item.order_no.includes(keyword) || 
        item.user.nickname.includes(keyword)
      )
    }
    
    // 分页处理
    const start = (page - 1) * limit
    const end = page * limit
    const paginatedList = filteredList.slice(start, end)
    
    return {
      code: 200,
      msg: '获取成功',
      data: {
        list: paginatedList,
        total: filteredList.length
      }
    }
  })

  // 退款申请详情接口
  Mock.mock(/^\/api\/refund\/detail/, 'get', ({ url }) => {
    const id = url.match(/\/api\/refund\/detail\/(\d+)/)[1]
    const refund = refunds.list.find(item => item.id == id)
    
    if (refund) {
      return {
        code: 200,
        msg: '获取成功',
        data: refund
      }
    } else {
      return {
        code: 404,
        msg: '退款申请不存在',
        data: null
      }
    }
  })

  // 处理退款申请接口
  Mock.mock('/api/refund/process', 'post', ({ body }) => {
    const { id, status } = JSON.parse(body)
    const refund = refunds.list.find(item => item.id == id)
    
    if (refund) {
      refund.status = status
      refund.process_time = Mock.Random.datetime()
      return {
        code: 200,
        msg: '操作成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '退款申请不存在',
        data: null
      }
    }
  })
}