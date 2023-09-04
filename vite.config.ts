import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import pkg from "./package.json";

export default defineConfig(({ command }) => {
  const config = {
    resolve: {
      alias: {
        src: "/src",
      },
    },
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          // svgr options
        },
      }),
    ],
    test: {
      environment: "jsdom",
      setupFiles: ["./__tests__/setup.ts"],
      testMatch: ["./__tests__/**/*.test.tsx"],
      globals: true,
    },
    base: "/",
    define: {
      "process.env.VERSION": JSON.stringify(pkg.version),
    },
  };

  if (command !== "serve") {
    config.base = "/asteroids/";
  }

  return config;
});
