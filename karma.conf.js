module.exports = function(config) {
  config.set({
    reporters: [ 'progress' ],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 20000,
    colors: true,
    autoWatch: false,
    browsers: [ 'PhantomJS', 'Chrome', 'Firefox', 'Safari' ],
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
      frameworks: [ 'hydro' ],
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
