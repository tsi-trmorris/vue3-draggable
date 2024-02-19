import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJs(),
    dts({
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname
    }
  },
  server: {
    host: 'devlocal.trans-system.com',
  },
  build: {
    cssCodeSplit: true,
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vue3-Draggable',
      fileName: (format) => `vue3-draggable.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
