import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig(({ mode }) => ({
  server: {
    port: 6400,
    https: true,
    open: true,
  },
  plugins: [
    ViteMinifyPlugin({
      caseSensitive: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      html5: true,
      keepClosingSlash: true,
      minifyURLs: true,
      quoteCharacter: '"',
      removeComments: true,
      removeEmptyAttributes: true,
      removeEmptyElements: false,
    }),
  ],
  css: { devSourcemap: true },
  logLevel: mode === "development" ? "info" : "silent",
  clearScreen: false,
  appType: "mpa",
  build: {
    target: "es6",
    assetsDir: "",
    assetsInlineLimit: 0,
    manifest: true,
    minify: mode === "development" ? "esbuild" : "terser",
    emptyOutDir: true,
    rollupOptions: {
      input: ["index.html", "about/index.html", "./404/index.html"],
      output: {
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
}));
