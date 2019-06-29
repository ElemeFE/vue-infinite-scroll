import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "./src/index.js",
  output: {
    file: "vue-infinite-scroll.js",
    format: "umd",
    name: 'infiniteScroll'
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    uglify()
  ]
};
