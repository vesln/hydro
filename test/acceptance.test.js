var fixtures = require('path').join(__dirname, 'fixtures');
var Dispatcher = require('../lib/hydro/dispatcher');

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
  var dispatcher = new Dispatcher;

  global.t = function() {
    return dispatcher.test.apply(dispatcher, arguments);
  };

  global.s = function() {
    return dispatcher.test.apply(dispatcher, arguments);
  };

  dispatcher.configure(opts, function() {
    dispatcher.loadTests();
    dispatcher.run(function() {
      global.t = null;
      global.s = null;
      fn.apply(null, arguments);
    });
  });
}
