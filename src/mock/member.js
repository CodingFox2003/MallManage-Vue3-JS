// 引入Mock.js
import Mock from 'mockjs'

// 模拟用户数据
const users = Mock.mock({
  'list|100': [{
    'id|+1': 1,
    'username': '@word(5,10)',
    'nickname': '@cname',
    'avatar': '@image("100x100")',
    'email': '@email',
    'phone': /^1[3-9]\d{9}$/,
    'gender|0-2': 1, // 0:未知 1:男 2:女
    'score|0-10000': 1,
    'level|1-4': 1,
    'level_name': '@ctitle(2,4)会员',
    'status|0-1': 1, // 0:禁用 1:正常
    'create_time': '@datetime',
    'last_login_time': '@datetime'
  }]
})

// 模拟用户等级数据
const userLevels = Mock.mock({
  'list|4': [{
    'id|+1': 1,
    'name': '@ctitle(2,4)会员',
    'level|+1': 1,
    'min_score|+1000': 0,
    'discount|85-100': 1,
    'description': '@cparagraph(1)',
    'status|0-1': 1
  }]
})

export default function() {
  // 用户列表接口
  Mock.mock('/api/member/list', 'get', ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const page = parseInt(params.get('page')) || 1
    const limit = parseInt(params.get('limit')) || 10
    const keyword = params.get('keyword') || ''
    
    let filteredList = users.list
    
    // 根据关键词筛选
    if (keyword) {
      filteredList = filteredList.filter(item => 
        item.username.includes(keyword) || 
        item.nickname.includes(keyword) ||
        item.phone.includes(keyword) ||
        item.email.includes(keyword)
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
  
  // 用户详情接口
  Mock.mock(/^\/api\/member\/detail/, 'get', ({ url }) => {
    const id = url.match(/\/api\/member\/detail\/(\d+)/)[1]
    const user = users.list.find(item => item.id == id)
    
    if (user) {
      return {
        code: 200,
        msg: '获取成功',
        data: user
      }
    } else {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      }
    }
  })
  
  // 添加用户接口
  Mock.mock('/api/member/add', 'post', ({ body }) => {
    const userData = JSON.parse(body)
    
    // 创建新用户
    const newUser = {
      id: users.list.length + 1,
      username: userData.username,
      nickname: userData.nickname,
      avatar: userData.avatar || Mock.Random.image("100x100"),
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender || 0,
      score: userData.score || 0,
      level: userData.level || 1,
      level_name: userLevels.list.find(item => item.level === (userData.level || 1))?.name || '普通会员',
      status: userData.status !== undefined ? userData.status : 1,
      create_time: Mock.Random.datetime(),
      last_login_time: Mock.Random.datetime()
    }
    
    users.list.unshift(newUser)
    
    return {
      code: 200,
      msg: '添加成功',
      data: newUser
    }
  })
  
  // 修改用户接口
  Mock.mock('/api/member/update', 'post', ({ body }) => {
    const { id, ...updateData } = JSON.parse(body)
    const userIndex = users.list.findIndex(item => item.id == id)
    
    if (userIndex !== -1) {
      // 更新用户信息
      users.list[userIndex] = {
        ...users.list[userIndex],
        ...updateData,
        level_name: userLevels.list.find(item => item.level === updateData.level)?.name || users.list[userIndex].level_name
      }
      
      return {
        code: 200,
        msg: '修改成功',
        data: users.list[userIndex]
      }
    } else {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      }
    }
  })
  
  // 删除用户接口
  Mock.mock('/api/member/delete', 'post', ({ body }) => {
    const { id } = JSON.parse(body)
    const userIndex = users.list.findIndex(item => item.id == id)
    
    if (userIndex !== -1) {
      users.list.splice(userIndex, 1)
      
      return {
        code: 200,
        msg: '删除成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      }
    }
  })
  
  // 用户等级列表接口
  Mock.mock('/api/member/level/list', 'get', () => {
    return {
      code: 200,
      msg: '获取成功',
      data: {
        list: userLevels.list
      }
    }
  })
  
  // 添加用户等级接口
  Mock.mock('/api/member/level/add', 'post', ({ body }) => {
    const levelData = JSON.parse(body)
    
    // 创建新等级
    const newLevel = {
      id: userLevels.list.length + 1,
      name: levelData.name,
      level: levelData.level,
      min_score: levelData.min_score,
      discount: levelData.discount,
      description: levelData.description,
      status: levelData.status !== undefined ? levelData.status : 1
    }
    
    userLevels.list.push(newLevel)
    
    return {
      code: 200,
      msg: '添加成功',
      data: newLevel
    }
  })
  
  // 修改用户等级接口
  Mock.mock('/api/member/level/update', 'post', ({ body }) => {
    const { id, ...updateData } = JSON.parse(body)
    const levelIndex = userLevels.list.findIndex(item => item.id == id)
    
    if (levelIndex !== -1) {
      // 更新等级信息
      userLevels.list[levelIndex] = {
        ...userLevels.list[levelIndex],
        ...updateData
      }
      
      return {
        code: 200,
        msg: '修改成功',
        data: userLevels.list[levelIndex]
      }
    } else {
      return {
        code: 404,
        msg: '等级不存在',
        data: null
      }
    }
  })
  
  // 删除用户等级接口
  Mock.mock('/api/member/level/delete', 'post', ({ body }) => {
    const { id } = JSON.parse(body)
    const levelIndex = userLevels.list.findIndex(item => item.id == id)
    
    if (levelIndex !== -1) {
      userLevels.list.splice(levelIndex, 1)
      
      return {
        code: 200,
        msg: '删除成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '等级不存在',
        data: null
      }
    }
  })
}