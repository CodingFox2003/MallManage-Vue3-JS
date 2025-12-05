import axios from '~/axios'

// 获取商品分类列表
export function getCategoryList() {
    return axios.get("/category/list")
}

// 添加商品分类
export function createCategory(data) {
    return axios.post("/category/create", data)
}

// 修改商品分类
export function updateCategory(data) {
    return axios.post("/category/update", data)
}

// 删除商品分类
export function deleteCategory(id) {
    return axios.post("/category/delete", { id })
}

// 获取商品列表
export function getGoodsList(page = 1) {
    return axios.get(`/goods/list?page=${page}`)
}

// 添加商品
export function createGoods(data) {
    return axios.post("/goods/create", data)
}

// 修改商品
export function updateGoods(data) {
    return axios.post("/goods/update", data)
}

// 删除商品
export function deleteGoods(id) {
    return axios.post("/goods/delete", { id })
}