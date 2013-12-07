var run = require('./support/run');

suite('acceptance', function() {
  test('passing tests', function(done) {
    run('passing.js', function(result) {
      result.passed.should.eq(3);
      done();
    });
  });

  test('failing tests', function(done) {
    run('failing.js', function(result) {
      result.failed.should.eq(5);
      done();
    });
  });

  test('skipped tests', function(done) {
    run('skipped.js', function(result) {
      result.failed.should.eq(0);
      result.passed.should.eq(0);
      done();
    });
  });
});
