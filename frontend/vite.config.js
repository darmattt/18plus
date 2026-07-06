import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["18plus_Logo_RGB.png"],
            manifest: {
                name: "18plus – Wegweisend zu Studium und Beruf",
                short_name: "18plus",
                description:
                    "Die moderne Lernplattform, die dir hilft, deinen Fortschritt zu verfolgen und in deinem Studium zu glänzen.",
                theme_color: "#006dd6",
                background_color: "#ffffff",
                display: "standalone",
                start_url: "/",
                icons: [
                    { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
                    {
                        src: "pwa-maskable-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: true,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:5000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
