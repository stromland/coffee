import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Coffee Brew Dashboard",
        short_name: "Coffee Brew",
        description: "Your digital barista",
        theme_color: "#2a1f1a",
        background_color: "#1a1410",
        display: "standalone",
        scope: "/coffee/",
        start_url: "/coffee/",
        icons: [
          {
            src: "/coffee/coffee-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/coffee/coffee-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  base: "/coffee",
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
