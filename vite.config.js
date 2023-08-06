import { glob } from "glob";
import * as autoprefixer from "autoprefixer";
import * as nested from "postcss-nested";
import * as scss from "postcss-scss";

/** @type {import('vite').UserConfig} */
export default {
  base: "https://marcosdly.dev",
  build: {
    target: "es2015",
    cssTarget: "es2015",
    publicDir: "public",
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    cssMinify: true,
    css: {
      postcss: {
        plugins: [autoprefixer, nested, scss],
      },
    },
    minify: true,
    rollupOptions: {
      input: glob.sync("**/*.html", { ignore: ["dist/**", "public/**"] }),
      output: {
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
};
