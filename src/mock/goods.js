import Mock from 'mockjs'

// 模拟商品分类数据
const categories = [
  {
    id: 1,
    name: '手机数码',
    parent_id: 0,
    status: 1,
    sort: 0,
    created_at: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    name: '家用电器',
    parent_id: 0,
    status: 1,
    sort: 0,
    created_at: '2023-01-01 12:00:00'
  },
  {
    id: 3,
    name: '服装鞋帽',
    parent_id: 0,
    status: 1,
    sort: 0,
    created_at: '2023-01-01 12:00:00'
  },
  {
    id: 4,
    name: '智能手机',
    parent_id: 1,
    status: 1,
    sort: 0,
    created_at: '2023-01-01 12:00:00'
  },
  {
    id: 5,
    name: '笔记本电脑',
    parent_id: 1,
    status: 1,
    sort: 0,
    created_at: '2023-01-01 12:00:00'
  }
]

// 模拟商品数据
const goods = []
for (let i = 1; i <= 20; i++) {
  goods.push({
    id: i,
    name: Mock.Random.ctitle(5, 10),
    category_id: Mock.Random.integer(1, 5),
    cover: Mock.Random.image('200x200', Mock.Random.color(), '商品'),
    desc: Mock.Random.csentence(10, 20),
    unit: '件',
    stock: Mock.Random.integer(0, 1000),
    price: Mock.Random.float(10, 9999, 2, 2),
    sale_price: Mock.Random.float(10, 9999, 2, 2),
    status: Mock.Random.integer(0, 1),
    created_at: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  })
}

export default function() {
  // 获取商品分类列表
  Mock.mock('/api/category/list', 'get', () => {
    return {
      code: 200,
      msg: '获取分类列表成功',
      data: {
        list: categories
      }
    }
  })

  // 获取商品列表
  Mock.mock('/api/goods/list', 'get', ({url}) => {
    const params = url.split('?')[1]
    const page = params ? new URLSearchParams(params).get('page') || 1 : 1
    
    // 分页处理
    const pageSize = 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = goods.slice(start, end)
    
    return {
      code: 200,
      msg: '获取商品列表成功',
      data: {
        list: list,
        total: goods.length,
        page: parseInt(page),
        page_size: pageSize
      }
    }
  })

  // 添加商品分类
  Mock.mock('/api/category/create', 'post', () => {
    return {
      code: 200,
      msg: '添加分类成功',
      data: null
    }
  })

  // 修改商品分类
  Mock.mock('/api/category/update', 'post', () => {
    return {
      code: 200,
      msg: '修改分类成功',
      data: null
    }
  })

  // 删除商品分类
  Mock.mock('/api/category/delete', 'post', () => {
    return {
      code: 200,
      msg: '删除分类成功',
      data: null
    }
  })

  // 添加商品
  Mock.mock('/api/goods/create', 'post', () => {
    return {
      code: 200,
      msg: '添加商品成功',
      data: null
    }
  })

  // 修改商品
  Mock.mock('/api/goods/update', 'post', () => {
    return {
      code: 200,
      msg: '修改商品成功',
      data: null
    }
  })

  // 删除商品
  Mock.mock('/api/goods/delete', 'post', () => {
    return {
      code: 200,
      msg: '删除商品成功',
      data: null
    }
  })
}