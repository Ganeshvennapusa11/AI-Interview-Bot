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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("scheduler")) return "react";
          if (id.includes("firebase")) return "firebase";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("jspdf")) return "pdf";
          if (id.includes("html2canvas")) return "html2canvas";
          if (id.includes("dompurify")) return "dompurify";
          if (id.includes("tsparticles")) return "particles";
          if (id.includes("three")) return "three";
          if (id.includes("lucide-react")) return "icons";
          return "vendor";
        },
      },
    },
  },
})
