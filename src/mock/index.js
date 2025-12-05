import Mock from 'mockjs'
import userApi from './user.js'
import goodsApi from './goods.js'
import adminApi from './admin.js'
import memberApi from './member.js'
import orderApi from './order.js'
import shopApi from './shop.js'
import commentApi from './comment.js'
import homeApi from './home.js'

// 设置延迟时间
Mock.setup({
  timeout: '200-600'
})

//调试信息
console.log('Mock service initializing...')

// 用户相关接口
userApi()

// 商品相关接口
goodsApi()

// 管理员相关接口
adminApi()

// 会员相关接口
memberApi()

// 订单相关接口
orderApi()

// 店铺相关接口
shopApi()

// 评论相关接口
commentApi()

// 首页相关接口
homeApi()

console.log('Mock service initialized successfully!')

export default Mock