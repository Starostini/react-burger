import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react({
      babel: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "defaults",
              modules: false,
            },
          ],
          "@babel/preset-react",
        ],
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              corejs: 3,
              useESModules: true,
            },
          ],
        ],
      },
    }),
  ],
});
