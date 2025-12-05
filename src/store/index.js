import { createStore } from "vuex";
import { login, getinfo } from "~/api/manager";
import { getAdminList } from "~/api/admin";
import { getGoodsList, getCategoryList } from "~/api/goods";
import { setToken, removeToken } from "~/composables/auth";
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      // 侧边宽度
      asideWidth: "250px",
      menus: [],
      ruleNames: [],
      // 管理员列表
      adminList: [],
      adminTotal: 0,
      // 商品列表
      goodsList: [],
      goodsTotal: 0,
      // 分类列表
      categoryList: [],
    };
  },
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    // 展开/缩起侧边
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px";
    },
    SET_MENUS(state, menu) {
      state.menus = menu;
    },
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
    // 设置管理员列表
    SET_ADMIN_LIST(state, { list, total }) {
      state.adminList = list;
      state.adminTotal = total;
    },
    // 设置商品列表
    SET_GOODS_LIST(state, { list, total }) {
      state.goodsList = list;
      state.goodsTotal = total;
    },
    // 设置分类列表
    SET_CATEGORY_LIST(state, list) {
      state.categoryList = list;
    },
  },
  actions: {
    // 登录
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login(username, password)
          .then((res) => {
            setToken(res.token);

            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 获取当前登录用户信息
    getinfo({ commit }) {
      return new Promise((resolve, reject) => {
        getinfo()
          .then((res) => {
            console.log(res);
            commit("SET_USERINFO", res.data);
            commit("SET_MENUS", res.data.menus);
            commit("SET_RULENAMES", res.data.ruleNames);
            resolve(res.data);
          })
          .catch((err) => reject(err));
      });
    },
    // 退出登录
    logout({ commit }) {
      // 移除cookie里的token
      removeToken();
      // 清除当前用户状态 vuex
      commit("SET_USERINFO", {});
    },
    // 获取管理员列表
    getAdminList({ commit }, page = 1) {
      return new Promise((resolve, reject) => {
        getAdminList(page)
          .then((res) => {
            commit("SET_ADMIN_LIST", {
              list: res.data.list,
              total: res.data.total
            });
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 获取商品列表
    getGoodsList({ commit }, page = 1) {
      return new Promise((resolve, reject) => {
        getGoodsList(page)
          .then((res) => {
            commit("SET_GOODS_LIST", {
              list: res.data.list,
              total: res.data.total
            });
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    // 获取分类列表
    getCategoryList({ commit }) {
      return new Promise((resolve, reject) => {
        getCategoryList()
          .then((res) => {
            commit("SET_CATEGORY_LIST", res.data.list);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
  },
});

export default store;