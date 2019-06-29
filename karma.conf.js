// Karma configuration
// Generated on Sat Jun 29 2019 11:46:16 GMT+0800 (China Standard Time)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: ["test/**/*.test.js"],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "test/**/*.js": ["rollup"]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress"],

    rollupPreprocessor: {
      /**
       * This is just a normal Rollup config object,
       * except that `input` is handled for you.
       */
      plugins: [
        require("rollup-plugin-babel")({
          exclude: "node_modules/**",
          presets: [require("@babel/preset-env")]
        }),
        require('rollup-plugin-node-globals')(),
        // require('rollup-plugin-commonjs')(),
        // require('rollup-plugin-json')(),
        require('rollup-plugin-node-resolve')(),
      ],
      output: {
        format: "iife", // Helps prevent naming collisions.
        name: "vueInfiniteScroll", // Required for 'iife' format.
        sourcemap: "inline" // Sensible for testing.
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS_custom'],

    // you can define custom flags
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          viewportSize: { width: 480, height: 800 }
        }
      }
    },

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
