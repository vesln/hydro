var Hydro = require('..');
var fixtures = require('path').join(__dirname, 'fixtures');

suite('acceptance', function() {
  test('passing tests', function(done) {
    run('passing.js', function(root) {
      root.result.passed.length.should.eq(3);
      done();
    });
  });

  test('failing tests', function(done) {
    run('failing.js', function(root) {
      root.result.failed.length.should.eq(5);
      done();
    });
  });

  test('skipped tests', function(done) {
    run('skipped.js', function(root) {
      root.result.skipped.length.should.eq(3);
      done();
    });
  });
});

function run(test, fn) {
  var options = { tests: [fixtures + '/' + test] };
  var hydro = new Hydro;

  global.t = function() {
    return hydro.addTest.apply(hydro, arguments);
  };

  global.s = function() {
    return hydro.addSuite.apply(hydro, arguments);
  };

  hydro.run(options, function(res) {
    global.t = null;
    fn(res);
  });
}
