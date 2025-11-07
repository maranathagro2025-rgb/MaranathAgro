import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // <--- AGREGA ESTO
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
quasar({
      sassVariables: path.resolve(__dirname, 'src/quasar-variables.sass')
    })

  ]
})
