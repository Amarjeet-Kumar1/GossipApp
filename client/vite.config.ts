import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    include: ["bson"],
    esbuildOptions: {
      supported: {
        "top-level-await": true,
      },
    },
  },
})
