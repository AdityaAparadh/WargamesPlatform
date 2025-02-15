import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import electron from "vite-plugin-electron";

export default defineConfig({
  plugins: [
    react(),
    electron({
      preload: {
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead of `build.lib.entry`.
        input: path.join(__dirname, "electron/preload.ts"),
      },
      // Polyfill the Electron and Node.js API for Renderer process.
      // If you want to use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      renderer:
        process.env.NODE_ENV === "test"
          ? undefined
          : {},
    }),
  ],
  optimizeDeps: {
    exclude: ["node-pty-prebuilt-multiarch"],
  },
  build: {
    minify: 'terser',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ["node-pty-prebuilt-multiarch"],
    },
  },
});
