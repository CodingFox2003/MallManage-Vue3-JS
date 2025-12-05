import axios from '~/axios'

// 获取管理员列表
export function getAdminList(page = 1) {
    return axios.get(`/admin/list?page=${page}`)
}

// 添加管理员
export function createAdmin(data) {
    return axios.post("/admin/create", data)
}

// 修改管理员
export function updateAdmin(data) {
    return axios.post("/admin/update", data)
}

// 删除管理员
export function deleteAdmin(id) {
    return axios.post("/admin/delete", { id })
}

// 获取角色列表
export function getRoleList() {
    return axios.get("/role/list")
}

// 添加角色
export function createRole(data) {
    return axios.post("/role/create", data)
}

// 修改角色
export function updateRole(data) {
    return axios.post("/role/update", data)
}

// 删除角色
export function deleteRole(id) {
    return axios.post("/role/delete", { id })
}