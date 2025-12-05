import Mock from 'mockjs'

// 模拟管理员用户数据
const admins = []
for (let i = 1; i <= 15; i++) {
  admins.push({
    id: i,
    username: Mock.Random.word(5, 10),
    nickname: Mock.Random.cname(),
    avatar: Mock.Random.image('100x100', Mock.Random.color(), '头像'),
    role: i === 1 ? '超级管理员' : Mock.Random.pick(['管理员', '运营人员', '客服']),
    status: Mock.Random.integer(0, 1),
    created_at: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  })
}

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

export default function() {
  // 获取管理员列表
  Mock.mock('/api/admin/list', 'get', (options) => {
    const params = options.url.split('?')[1]
    const page = params ? new URLSearchParams(params).get('page') || 1 : 1
    
    // 分页处理
    const pageSize = 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = admins.slice(start, end)
    
    return {
      code: 200,
      msg: '获取管理员列表成功',
      data: {
        list: list,
        total: admins.length,
        page: parseInt(page),
        page_size: pageSize
      }
    }
  })

  // 添加管理员
  Mock.mock('/api/admin/create', 'post', () => {
    return {
      code: 200,
      msg: '添加管理员成功',
      data: null
    }
  })

  // 修改管理员
  Mock.mock('/api/admin/update', 'post', () => {
    return {
      code: 200,
      msg: '修改管理员成功',
      data: null
    }
  })

  // 删除管理员
  Mock.mock('/api/admin/delete', 'post', () => {
    return {
      code: 200,
      msg: '删除管理员成功',
      data: null
    }
  })

  // 获取角色列表
  Mock.mock('/api/role/list', 'get', () => {
    return {
      code: 200,
      msg: '获取角色列表成功',
      data: {
        list: roles
      }
    }
  })

  // 添加角色
  Mock.mock('/api/role/create', 'post', () => {
    return {
      code: 200,
      msg: '添加角色成功',
      data: null
    }
  })

  // 修改角色
  Mock.mock('/api/role/update', 'post', () => {
    return {
      code: 200,
      msg: '修改角色成功',
      data: null
    }
  })

  // 删除角色
  Mock.mock('/api/role/delete', 'post', () => {
    return {
      code: 200,
      msg: '删除角色成功',
      data: null
    }
  })
}