import * as vite from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default vite.defineConfig(({ command, mode }) => {
  /** @type {vite.WatchOptions} */
  const forceFasterHotUpdate = {
    usePolling: true,
    interval: 300, // ms
    binaryInterval: 300, // ms
  };

  /** @type {vite.UserConfig} */
  let config = {
    server: {
      port: 6400,
      open: true,
    },
    plugins: [
      ViteMinifyPlugin({
        caseSensitive: true,
        collapseInlineTagWhitespace: false,
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
    clearScreen: false,
    appType: "mpa",
    build: {
      target: "es6",
      assetsDir: "",
      assetsInlineLimit: 0,
      manifest: true,
      emptyOutDir: true,
      rollupOptions: {
        input: ["index.html", "about/index.html", "./404/index.html"],
        output: {
          entryFileNames: "[name]-[hash].js",
          chunkFileNames: "[name]-[hash].js",
          assetFileNames: "[name]-[hash][extname]",
        },
      },
      terserOptions: {
        format: { comments: false },
      },
    },
    esbuild: { legalComments: "none" },
  };

  if (command === "serve" && mode === "development") {
    config.logLevel = "info";
    config.build.minify = "esbuild";
    config.server.watch = { ...config.server.watch, ...forceFasterHotUpdate };
  }

  if (mode === "production") {
    config.logLevel = "silent";
    build.minify = "terser";
  }

  return config;
});
