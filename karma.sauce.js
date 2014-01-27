/**
 * Dependencies.
 */

var env = require('envc');

/**
 * Browsers.
 */

var browsers = {
  'SL_Chrome': {
    base: 'SauceLabs',
    browserName: 'chrome'
  },
  'SL_Firefox_26': {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows XP',
    version: '26'
  },
  'SL_Safari': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.9',
    version: '7'
  },
  'SL_IE_8': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '8'
  },
  'SL_IE_9': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2008',
    version: '9'
  },
  'SL_IE_10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2012',
    version: '10'
  },
  'SL_IE_11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
};

/**
 * Configure Karma to run the tests on SauceLabs.
 *
 * @param {Object} config
 * @api public
 */

module.exports = function(config) {
  var package = require('./package.json');
  var branch = process.env.TRAVIS_BRANCH || 'local';
  var tags = [package.name + '_' + package.version, user + '@' + branch];

  // Credentials
  var user = process.env.SAUCE_HYDRO_USERNAME || process.env.SAUCE_USERNAME;
  var key = process.env.SAUCE_HYDRO_ACCESS_KEY || process.env.SAUCE_ACCESS_KEY;

  // Browser versions
  var versions = process.env.BROWSER
    ? process.env.BROWSERS.split(',')
    : Object.keys(browsers);

  // Do not run when on Travis CI and the current node version
  // doesn't match the configured one
  if (process.version.indexOf(process.env.KARMA_RUN_ON) !== 0 && process.env.TRAVIS) {
    process.exit(0);
  }

  if (process.env.TRAVIS_JOB_NUMBER) {
    tags.push('travis@' + process.env.TRAVIS_JOB_NUMBER);
  }

  config.browsers = versions;
  config.customLaunchers = {};
  config.reporters.push('saucelabs');
  config.transports = ['xhr-polling'];

  versions.forEach(function(key) {
    if (!browsers[key]) throw new Error('Invalid browser: ' + key);
    config.customLaunchers[key] = browsers[key];
  });

  config.sauceLabs = {
    username: user,
    accessKey: key,
    startConnect: true,
    tags: tags,
    testName: package.name,
    tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || new Date().getTime()
  };
};
