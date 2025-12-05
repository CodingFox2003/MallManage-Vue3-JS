import Mock from 'mockjs'

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nickname: '管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    menus: [
      {
        id: 100,
        name: '后台首页',
        icon: 'HomeFilled',
        url: '/'
      },
      {
        id: 200,
        name: '商品管理',
        icon: 'Goods',
        url: '',
        children: [
          {
            id: 201,
            name: '商品列表',
            icon: 'List',
            url: '/goods/list'
          },
          {
            id: 202,
            name: '分类列表',
            icon: 'Files',
            url: '/category/list'
          },
          {
            id: 203,
            name: '商品评论',
            icon: 'ChatLineRound',
            url: '/goods/comment'
          }
        ]
      },
      {
        id: 300,
        name: '订单管理',
        icon: 'Document',
        url: '',
        children: [
          {
            id: 301,
            name: '订单列表',
            icon: 'List',
            url: '/order/list'
          },
          {
            id: 302,
            name: '退款管理',
            icon: 'RefreshLeft',
            url: '/order/refund'
          }
        ]
      },
      {
        id: 400,
        name: '店铺管理',
        icon: 'Shop',
        url: '',
        children: [
          {
            id: 401,
            name: '店铺列表',
            icon: 'List',
            url: '/shop/list'
          },
          {
            id: 402,
            name: '店铺审核',
            icon: 'CircleCheck',
            url: '/shop/audit'
          }
        ]
      },
      {
        id: 500,
        name: '用户管理',
        icon: 'User',
        url: '',
        children: [
          {
            id: 501,
            name: '用户列表',
            icon: 'List',
            url: '/user/list'
          },
          {
            id: 502,
            name: '用户等级',
            icon: 'Medal',
            url: '/user/level'
          }
        ]
      }
    ],
    ruleNames: ['sys:user:list', 'sys:user:create', 'sys:user:update', 'sys:user:delete', 'sys:role:list']
  },
  {
    id: 2,
    username: 'test',
    password: 'test123',
    nickname: '测试用户',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    menus: [
      {
        id: 100,
        name: '后台首页',
        icon: 'HomeFilled',
        url: '/'
      },
      {
        id: 200,
        name: '商品管理',
        icon: 'Goods',
        url: '',
        children: [
          {
            id: 201,
            name: '商品列表',
            icon: 'List',
            url: '/goods/list'
          }
        ]
      }
    ],
    ruleNames: ['sys:user:list']
  }
]

export default function() {
  // 登录接口
  Mock.mock('/api/admin/login', 'post', (options) => {
    const { username, password } = JSON.parse(options.body)
    
    // 查找用户
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
      return {
        code: 200,
        msg: '登录成功',
        data: {
          token: Mock.Random.string('abcdefghijklmnopqrstuvwxyz0123456789', 32)
        }
      }
    } else {
      return {
        code: 400,
        msg: '用户名或密码错误',
        data: null
      }
    }
  })

  // 获取用户信息接口
  Mock.mock('/api/admin/getinfo', 'post', (options) => {
    // 在实际应用中，这里应该通过token获取用户信息
    // 这里我们简化处理，返回第一个用户的信息
    return {
      code: 200,
      msg: '获取用户信息成功',
      data: users[0]
    }
  })

  // 退出登录接口
  Mock.mock('/api/admin/logout', 'post', () => {
    return {
      code: 200,
      msg: '退出登录成功',
      data: null
    }
  })

  // 修改密码接口
  Mock.mock('/api/admin/updatepassword', 'post', () => {
    return {
      code: 200,
      msg: '密码修改成功',
      data: null
    }
  })
}