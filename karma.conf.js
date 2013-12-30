module.exports = function(config) {
  config.set({
    basePath: '',
    files: [ 'build/browserify.js'],
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

  if (process.env.TEST_ENV === 'sauce') {
    require('./karma.sauce')(config);
  }
};
