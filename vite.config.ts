import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
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
  // 构建配置
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MultipleDatePicker',
      fileName: (format) => `multiple-date-picker.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'element-plus', 'dayjs'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          'dayjs': 'dayjs'
        }
      }
    }
  }
})