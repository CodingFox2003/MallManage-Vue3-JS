import Mock from 'mockjs'

// 模拟商品评论数据
const comments = Mock.mock({
  'list|100': [{
    'id|+1': 1,
    'goods_id|1-100': 1,
    'goods': {
      'name': '@ctitle(5,10)'
    },
    'user_id|1-100': 1,
    'user': {
      'nickname': '@cname',
      'avatar': '@image("100x100")'
    },
    'rating|1-5': 1,
    'content': '@cparagraph(1,3)',
    'images|0-3': ['@image("200x200")'],
    'reply': '@cparagraph(1,2)',
    'status|0-1': 1, // 0:隐藏 1:显示
    'create_time': '@datetime',
    'reply_time': '@datetime'
  }]
})

export default function() {
  // 商品评论列表接口
  Mock.mock('/api/comment/list', 'get', ({ url }) => {
    const params = new URLSearchParams(url.split('?')[1])
    const page = parseInt(params.get('page')) || 1
    const limit = parseInt(params.get('limit')) || 10
    const keyword = params.get('keyword') || ''
    
    let filteredList = comments.list
    
    // 根据关键词筛选
    if (keyword) {
      filteredList = filteredList.filter(item => 
        item.goods.name.includes(keyword) || 
        item.user.nickname.includes(keyword) ||
        item.content.includes(keyword)
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

  // 商品评论详情接口
  Mock.mock(/^\/api\/comment\/detail/, 'get', ({ url }) => {
    const id = url.match(/\/api\/comment\/detail\/(\d+)/)[1]
    const comment = comments.list.find(item => item.id == id)
    
    if (comment) {
      return {
        code: 200,
        msg: '获取成功',
        data: comment
      }
    } else {
      return {
        code: 404,
        msg: '评论不存在',
        data: null
      }
    }
  })

  // 回复商品评论接口
  Mock.mock('/api/comment/reply', 'post', ({ body }) => {
    const { id, reply } = JSON.parse(body)
    const comment = comments.list.find(item => item.id == id)
    
    if (comment) {
      comment.reply = reply
      comment.reply_time = Mock.Random.datetime()
      return {
        code: 200,
        msg: '回复成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '评论不存在',
        data: null
      }
    }
  })

  // 修改商品评论状态接口
  Mock.mock('/api/comment/update_status', 'post', ({ body }) => {
    const { id, status } = JSON.parse(body)
    const comment = comments.list.find(item => item.id == id)
    
    if (comment) {
      comment.status = status
      return {
        code: 200,
        msg: '操作成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '评论不存在',
        data: null
      }
    }
  })

  // 删除商品评论接口
  Mock.mock('/api/comment/delete', 'post', ({ body }) => {
    const { id } = JSON.parse(body)
    const commentIndex = comments.list.findIndex(item => item.id == id)
    
    if (commentIndex !== -1) {
      comments.list.splice(commentIndex, 1)
      
      return {
        code: 200,
        msg: '删除成功',
        data: null
      }
    } else {
      return {
        code: 404,
        msg: '评论不存在',
        data: null
      }
    }
  })
}