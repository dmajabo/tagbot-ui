import {defineConfig} from "vite"
import { fileURLToPath, URL } from "url"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: [
      {
        find: "vue-i18n",
        replacement: "vue-i18n/dist/vue-i18n.cjs.js",
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  server: {
    https: false,
    host: "localhost",
    port: 3000,
  },
})
