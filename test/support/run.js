/**
 * Fixtures path.
 */

var fixtures = require('path').join(__dirname, 'fixtures');

/**
 * Build a new `Hydro` instance, execute fixture/`test` and
 * capture the results.
 *
 * @param {String} test
 * @param {Function} done
 * @api public
 */

module.exports = function(test, fn) {
  var options = { tests: [fixtures + '/' + test], formatter: null };
  var hydro = Hydro();
  var result = { failed: 0, passed: 0, skipped: 0, tests: [] };

  hydro.set(options);

  global.it = function() {
    return hydro.addTest.apply(hydro, arguments);
  };

  global.describe = function() {
    return hydro.addSuite.apply(hydro, arguments);
  };

  hydro.on('post:test', function(test) {
    result.tests.push(test);
    if (test.skipped) return result.skipped++;
    if (test.failed) return result.failed++;
    result.passed++;
  });

  hydro.run(function() {
    global.it = null;
    global.describe = null;
    fn(result);
  });
};
