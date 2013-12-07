var fixtures = require('path').join(__dirname, 'fixtures');
var Runner = require('../lib/hydro/runner');

test('passing tests', function(done) {
  run('passing.js', function(res) {
    res.passed.length.should.eq(3);
    done();
  });
});

test('failing tests', function(done) {
  run('failing.js', function(res) {
    res.failed.length.should.eq(5);
    done();
  });
});

test('skipped tests', function(done) {
  run('skipped.js', function(res) {
    res.skipped.length.should.eq(3);
    done();
  });
});

function run(test, fn) {
  var opts = { tests: [fixtures + '/' + test] };
  var runner = new Runner;

  global.t = function() {
    return runner.test.apply(runner, arguments);
  };

  global.s = function() {
    return runner.test.apply(runner, arguments);
  };

  runner.configure(opts, function() {
    runner.loadTests();
    runner.run(function() {
      global.t = null;
      global.s = null;
      fn.apply(null, arguments);
    });
  });
}
