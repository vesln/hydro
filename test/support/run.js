var fixtures = require('path').join(__dirname, '..', 'fixtures');

module.exports = function(test, fn) {
  var options = { tests: [fixtures + '/' + test] };
  var hydro = new Hydro;
  var result = { failed: 0, passed: 0, skipped: 0, tests: [] };

  global.t = function() {
    return hydro.addTest.apply(hydro, arguments);
  };

  global.s = function() {
    return hydro.addSuite.apply(hydro, arguments);
  };

  hydro.on('post:test', function(test) {
    result.tests.push(test);
    if (test.skipped) return result.skipped++;
    if (test.failed) return result.failed++;
    result.passed++;
  });

  hydro.run(options, function() {
    global.t = null;
    global.s = null;
    fn(result);
  });
};
