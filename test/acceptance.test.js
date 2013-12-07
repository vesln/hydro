var run = require('./support/run');

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
    result.skipped.should.eq(3);
    done();
  });
});

test('nested suites', function(done) {
  run('nested.js', function(result) {
    result.tests[0].title.should.eq('test 0');
    result.tests[0].suite.title.should.eq('root');

    result.tests[1].title.should.eq('test 1');
    result.tests[1].suite.title.should.eq('suite 1');

    result.tests[2].title.should.eq('test 1.1');
    result.tests[2].suite.title.should.eq('suite 1');

    result.tests[3].title.should.eq('test 2');
    result.tests[3].suite.title.should.eq('suite 2');

    done();
  });
});
