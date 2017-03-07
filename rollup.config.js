import babel from 'rollup-plugin-babel';

export default {
  entry: './src/index.js',
  dest: 'vue-infinite-scroll.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [
        [ "es2015", { "modules": false } ]
      ],
      plugins: [
        "external-helpers"
      ]
    })
  ],
  format: 'umd',
  moduleName: 'infiniteScroll'
};
