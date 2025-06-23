import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 示例应用的 Vite 配置
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // 开发模式配置
  server: {
    port: 3000,
    open: true
  },
  // 指定示例应用的根目录
  root: 'examples',
  // 构建配置
  build: {
    outDir: '../dist-examples'
  }
})