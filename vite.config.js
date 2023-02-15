import { defineConfig } from "vite";

export default defineConfig({
  // plugins: [...]
  base: "/voiracing/",
  resolve: {
    alias: {
      util: "rollup-plugin-node-polyfills/polyfills/util",
    },
  },
});
