import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-transition-group/TransitionGroupContext":
        "react-transition-group/esm/TransitionGroupContext.js",
    },
  },
  ssr: {
    noExternal: ["@mui/material"],
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    alias: [
      {
        find: /^@mui\/icons-material(\/.*)?$/,
        replacement: fileURLToPath(new URL("./src/test/iconMock.jsx", import.meta.url)),
      },
    ],
  },
})
