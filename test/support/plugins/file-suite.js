/**
 * Dependencies.
 */

var basename = require('path').basename;

/**
 * Generate test suite name from filename.
 *
 * @param {String} filename
 * @returns {String}
 * @api private
 */

function nameify(file) {
  var file = file.split('.');
  file.pop();
  file = file.join('.');
  var ret = basename(file).replace(/\./g, '#');
  ret = ret.replace(/-/g, ' ');
  return ret;
}

/**
 * Add a test suite for each required file.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.on('pre:file', function(file, done) {
    hydro.addSuite(nameify(file), function() {
      require(file);
    });
    done(true);
  });
};
