import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // ensures correct asset paths when deployed
  server: {
    port: 5173, // optional: define local dev port
  },
  build: {
    outDir: "dist", // Vercel auto-serves from this
  },
})
