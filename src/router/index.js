import { createRouter, createWebHashHistory } from "vue-router";

import Admin from "~/layouts/admin.vue";
import Index from "~/pages/index.vue";
import Login from "~/pages/login.vue";
import NotFound from "~/pages/404.vue";
import GoodList from "~/pages/goods/list.vue";
import CategoryList from "~/pages/category/list.vue";

// 默认路由,所有用户共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登录页",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

// 动态匹配添加路由
const asyncRoutes = [
  {
    path: "/",
    name: "/",
    component: Index,
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodList,
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/goods/comment",
    name: "/goods/comment",
    component: () => import("~/pages/goods/comment.vue"),
    meta: {
      title: "商品评论",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: () => import("~/pages/order/list.vue"),
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/order/refund",
    name: "/order/refund",
    component: () => import("~/pages/order/refund.vue"),
    meta: {
      title: "退款管理",
    },
  },
  {
    path: "/shop/list",
    name: "/shop/list",
    component: () => import("~/pages/shop/list.vue"),
    meta: {
      title: "店铺列表",
    },
  },
  {
    path: "/shop/audit",
    name: "/shop/audit",
    component: () => import("~/pages/shop/audit.vue"),
    meta: {
      title: "店铺审核",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: () => import("~/pages/user/list.vue"),
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/user/level",
    name: "/user/level",
    component: () => import("~/pages/user/level.vue"),
    meta: {
      title: "用户等级",
    },
  },
  {
    path: "/admin/user/list",
    name: "/admin/user/list",
    component: () => import("~/pages/admin/user/list.vue"),
    meta: {
      title: "管理员管理",
    },
  },
  {
    path: "/admin/role/list",
    name: "/admin/role/list",
    component: () => import("~/pages/admin/role/list.vue"),
    meta: {
      title: "角色管理",
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//动态添加路由方法
export function addRoutes(menus) {
  //是否有新的路由
  let hasNewRoutes = false;
  const findAndAddRoutesByMenus = (arr) => {
    // 添加安全检查，防止arr为undefined或null
    if (!arr || !Array.isArray(arr)) {
      return;
    }
    
    arr.forEach((e) => {
      let item = asyncRoutes.find((o) => o.path == e.url);
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item);
        hasNewRoutes = true;
      }
      //子路由
      if (e.children && e.children.length > 0) {
        findAndAddRoutesByMenus(e.children);
      }
    });
  };
  findAndAddRoutesByMenus(menus)

  // console.log("获取路由",router.getRoutes());
  return hasNewRoutes;
}