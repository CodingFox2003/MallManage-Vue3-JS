import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    // src目录别名
    alias:{
      "~": path.resolve(__dirname, "src")
    }
  },
  // 服务器配置
  server:{
    port: 3000
  },
  plugins: [vue(), WindiCSS()]
})