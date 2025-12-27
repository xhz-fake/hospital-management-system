import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,// 前端开发服务器端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址 , 若运行在其他机器上, 需要修改为后端服务器的IP地址
        changeOrigin: true
      }
    }
  }
})

