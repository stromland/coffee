import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

if (!process.env.VITE_BASE_URL) {
  throw new Error("VITE_BASE_URL is not defined");
}

const baseUrl = process.env.VITE_BASE_URL;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module",
      },
      injectRegister: "auto",
      strategies: "generateSW",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/coffee/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "coffee-routes",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
      manifest: {
        name: "Coffee Brew Dashboard",
        short_name: "Coffee Brew",
        description: "Your digital barista",
        theme_color: "#2a1f1a",
        background_color: "#1a1410",
        display: "standalone",
        scope: "/coffee/",
        start_url: baseUrl,
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
    }),
  ],
  base: baseUrl,
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
