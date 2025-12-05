import { router } from "./router";
import store from "./store";
// 引入mock数据
import "./mock"

import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "virtual:windi.css";
import "nprogress/nprogress.css";

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

import "./permission";

app.mount("#app");