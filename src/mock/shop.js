// 引入Mock.js
import Mock from 'mockjs'

// 模拟店铺数据
const shops = Mock.mock({
  'list|50': [{
    'id|+1': 1,
    'name': '@ctitle(5,10)店铺',
    'logo': '@image("100x100")',
    'owner_id|1-100': 1,
    'owner': {
      'username': '@word(5,10)',
      'nickname': '@cname'
    },
    'phone': /^1[3-9]\d{9}$/,
    'address': '@county(true) @cword(3,8) @natural(1,20)号',
    'description': '@cparagraph(2,5)',
    'category|1-5': ['@ctitle(2,4)'],
    'score|1-5.1': 1,
    'status|0-2': 1, // 0:待审核 1:正常营业 2:已关闭
    'create_time': '@datetime',
    'update_time': '@datetime'
  }]
})

export default function() {
  // 店铺列表接口
  Mock.mock('/api/shop/list', 'get', ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const page = parseInt(params.get('page')) || 1
    const limit = parseInt(params.get('limit')) || 10
    const keyword = params.get('keyword') || ''
    
    let filteredList = shops.list
    
    // 根据关键词筛选
    if (keyword) {
      filteredList = filteredList.filter(item => 
        item.name.includes(keyword) || 
        item.owner.nickname.includes(keyword) ||
        item.phone.includes(keyword)
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
  
  // 店铺详情接口
  Mock.mock(/^\/api\/shop\/detail/, 'get', ({ url }) => {
    const id = url.match(/\/api\/shop\/detail\/(\d+)/)[1]
    const shop = shops.list.find(item => item.id == id)
    
    if (shop) {
      return {
        code: 200,
        msg: '获取成功',
        data: shop
      }
    } else {
      return {
        code: 404,
        msg: '店铺不存在',
        data: null
      }
    }
  })
  
  // 添加店铺接口
  Mock.mock('/api/shop/add', 'post', ({ body }) => {
    const shopData = JSON.parse(body)
    
    // 创建新店铺
    const newShop = {
      id: shops.list.length + 1,
      name: shopData.name,
      logo: shopData.logo || Mock.Random.image("100x100"),
      owner_id: shopData.owner_id,
      owner: {
        username: shopData.owner_username,
        nickname: shopData.owner_nickname
      },
      phone: shopData.phone,
      address: shopData.address,
      description: shopData.description,
      category: shopData.category,
      score: 5.0,
      status: 0, // 默认待审核
      create_time: Mock.Random.datetime(),
      update_time: Mock.Random.datetime()
    }
    
    shops.list.unshift(newShop)
    
    return {
      code: 200,
      msg: '添加成功',
      data: newShop
    }
  })
  
  // 修改店铺接口
  Mock.mock('/api/shop/update', 'post', ({ body }) => {
    const { id, ...updateData } = JSON.parse(body)
    const shopIndex = shops.list.findIndex(item => item.id == id)
    
    if (shopIndex !== -1) {
      // 更新店铺信息
      shops.list[shopIndex] = {
        ...shops.list[shopIndex],
        ...updateData,
        update_time: Mock.Random.datetime()
      }
      
      return {
        code: 200,
        msg: '修改成功',
        data: shops.list[shopIndex]
      }
    } else {
      return {
        code: 404,
        msg: '店铺不存在',
        data: null
      }
    }
  })
  
  // 删除店铺接口
  Mock.mock('/api/shop/delete', 'post', ({ body }) => {
    const { id } = JSON.parse(body)
    const shopIndex = shops.list.findIndex(item => item.id == id)
    
    if (shopIndex !== -1) {
      shops.list.splice(shopIndex, 1)
      
      return {
        code: 200,
        msg: '删除成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '店铺不存在',
        data: null
      }
    }
  })
  
  // 店铺审核列表接口
  Mock.mock('/api/shop/audit/list', 'get', ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const page = parseInt(params.get('page')) || 1
    const limit = parseInt(params.get('limit')) || 10
    const keyword = params.get('keyword') || ''
    
    // 筛选待审核的店铺
    let filteredList = shops.list.filter(item => item.status === 0)
    
    // 根据关键词筛选
    if (keyword) {
      filteredList = filteredList.filter(item => 
        item.name.includes(keyword) || 
        item.owner.nickname.includes(keyword)
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
  
  // 审核店铺接口
  Mock.mock('/api/shop/audit', 'post', ({ body }) => {
    const { id, status } = JSON.parse(body)
    const shop = shops.list.find(item => item.id == id)
    
    if (shop) {
      shop.status = status
      shop.update_time = Mock.Random.datetime()
      
      return {
        code: 200,
        msg: '操作成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '店铺不存在',
        data: null
      }
    }
  })
}