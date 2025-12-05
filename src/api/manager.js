import axios from '~/axios'

// 用户认证相关API
export function login(username, password) {
    return axios.post("/admin/login", {
        username,
        password
    })
}

export function getinfo() {
    return axios.post("/admin/getinfo")
}

export function logout() {
    return axios.post("/admin/logout")
}

export function updatepassword(data) {
    return axios.post("/admin/updatepassword", data)
}

// 商品评论相关API
export function getCommentList(page, limit, keyword = '') {
    return axios.get(`/comment/list?page=${page}&limit=${limit}&keyword=${keyword}`)
}

export function getCommentDetail(id) {
    return axios.get(`/comment/detail/${id}`)
}

export function replyComment(id, reply) {
    return axios.post("/comment/reply", { id, reply })
}

export function updateCommentStatus(id, status) {
    return axios.post("/comment/update_status", { id, status })
}

export function deleteComment(id) {
    return axios.post("/comment/delete", { id })
}

// 订单相关API
export function getOrderList(page, limit, keyword = '') {
    return axios.get(`/order/list?page=${page}&limit=${limit}&keyword=${keyword}`)
}

export function getOrderDetail(id) {
    return axios.get(`/order/detail/${id}`)
}

export function updateOrderStatus(id, status) {
    return axios.post("/order/update_status", { id, status })
}

// 退款相关API
export function getRefundList(page, limit, keyword = '') {
    return axios.get(`/refund/list?page=${page}&limit=${limit}&keyword=${keyword}`)
}

export function getRefundDetail(id) {
    return axios.get(`/refund/detail/${id}`)
}

export function processRefund(id, status) {
    return axios.post("/refund/process", { id, status })
}

// 店铺相关API
export function getShopList(page, limit, keyword = '') {
    return axios.get(`/shop/list?page=${page}&limit=${limit}&keyword=${keyword}`)
}

export function getShopDetail(id) {
    return axios.get(`/shop/detail/${id}`)
}

export function addShop(data) {
    return axios.post("/shop/add", data)
}

export function updateShop(id, data) {
    return axios.post("/shop/update", { id, ...data })
}

export function deleteShop(id) {
    return axios.post("/shop/delete", { id })
}

// 店铺审核相关API
export function getAuditShopList(page, limit, keyword = '') {
    return axios.get(`/shop/audit/list?page=${page}&limit=${limit}&keyword=${keyword}`)
}

export function auditShop(id, status) {
    return axios.post("/shop/audit", { id, status })
}

// 用户相关API
export function getUserList(page, limit, keyword = '') {
    return axios.get(`/member/list?page=${page}&limit=${limit}&keyword=${keyword}`)
}

export function getUserDetail(id) {
    return axios.get(`/member/detail/${id}`)
}

export function addUser(data) {
    return axios.post("/member/add", data)
}

export function updateUser(id, data) {
    return axios.post("/member/update", { id, ...data })
}

export function deleteUser(id) {
    return axios.post("/member/delete", { id })
}

// 用户等级相关API
export function getUserLevelList() {
    return axios.get("/member/level/list")
}

export function addUserLevel(data) {
    return axios.post("/member/level/add", data)
}

export function updateUserLevel(id, data) {
    return axios.post("/member/level/update", { id, ...data })
}

export function deleteUserLevel(id) {
    return axios.post("/member/level/delete", { id })
}

// 首页相关API
export function getHomeStatistics() {
    return axios.get("/home/statistics")
}

export function getLatestOrders() {
    return axios.get("/home/latest-orders")
}

export function getHotGoods() {
    return axios.get("/home/hot-goods")
}

export function getSalesTrend() {
    return axios.get("/home/sales-trend")
}