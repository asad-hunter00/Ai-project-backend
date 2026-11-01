import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["terminal.local"],
    proxy: {
      "/backend": {
        target: "https://ai-project-backend-tkol.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend(?=\/|$)/, ""),
      },
    },
  },
});
