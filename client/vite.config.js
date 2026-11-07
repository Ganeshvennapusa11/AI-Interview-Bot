import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // absolute paths so deep links (/reset-password/:token) load assets correctly
  server: {
    port: 5173, // optional: define local dev port
  },
  build: {
    outDir: "dist", // Vercel auto-serves from this
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("tsparticles")) return "particles";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("jspdf")) return "pdf";
          if (id.includes("html2canvas")) return "html2canvas";
          if (id.includes("dompurify")) return "dompurify";
          if (id.includes("axios")) return "http";
          if (id.includes("react") || id.includes("scheduler")) return "react";
          return "vendor";
        },
      },
    },
  },
})
