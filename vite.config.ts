import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                chess: resolve(__dirname, "chess.html"),
                contact: resolve(__dirname, "contact.html"),
                features: resolve(__dirname, "features.html"),
                impress: resolve(__dirname, "impress.html"),
                rules: resolve(__dirname, "rules.html"),
                statistics: resolve(__dirname, "statistics.html"),
            },
        },
    },
});