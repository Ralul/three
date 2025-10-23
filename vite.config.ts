import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                chess: resolve(__dirname, "chess.html"),
                login: resolve(__dirname, "login.html"),
            },
        },
    },
});