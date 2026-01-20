import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { normalizePath } from 'vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            // Đường dẫn đến thư mục wasm trong node_modules
            src: normalizePath(resolve(__dirname, 'node_modules/@mediapipe/tasks-vision/wasm/*')),
            // Copy vào thư mục wasm trong output của renderer
            dest: 'wasm'
          }
        ]
      })
    ]
  }
})
