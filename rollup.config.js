import { getBabelOutputPlugin } from "@rollup/plugin-babel";

export default {
  input: "./src/index.js",
  output: {
    file: "vue-infinite-scroll.js",
    format: "esm",
    name: "infiniteScroll",
    plugins: [
      getBabelOutputPlugin({
        presets: [["@babel/preset-env", { modules: "umd" }]],
      }),
    ],
  },
};
