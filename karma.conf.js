module.exports = function(config) {
  config.set({
    basePath: '',
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],
    captureTimeout: 60000,
    singleRun: true,
    client: {
      hydro: {
        suite: 'hydro',
        plugins: ['hydro-minimal']
      }
    },
  });

  if (process.env.KARMA_TARGET === 'browserify') {
    // browserify
    config.set({
      files: [ 'build/browserify.js']
    });
  } else {
    // component
    config.set({
      frameworks: ['hydro'],
      files: [
        'build/build.js',
        'hydro.karma.js',
        'test/*.js'
      ]
    });
  }

  if (process.env.TEST_ENV === 'sauce') {
    require('./karma.sauce')(config);
  }
};
