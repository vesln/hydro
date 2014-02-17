var run = require('../support/run');

t('passing tests', function(done) {
  run('passing.js', function(result) {
    assert(result.passed === 3);
    done();
  });
});

t('failing tests', function(done) {
  run('failing.js', function(result) {
    assert(result.failed === 5);
    done();
  });
});

t('skipped tests', function(done) {
  run('skipped.js', function(result) {
    assert(result.skipped === 2);
    done();
  });
});

t('pending tests', function(done) {
  run('pending.js', function(result) {
    assert(result.pending === 2);
    done();
  });
});

t('nested suites', function(done) {
  run('nested.js', function(result) {
    assert(result.tests[0].title === 'test 0');
    assert(result.tests[0].suite.title === 'root');

    assert(result.tests[1].title === 'test 1');
    assert(result.tests[1].suite.title === 'suite 1');
    assert(result.tests[1].suite.parent.title === 'root');

    assert(result.tests[2].title === 'test 2');
    assert(result.tests[2].suite.title === 'suite 2');
    assert(result.tests[2].suite.parent.title === 'suite 1');

    assert(result.tests[3].title === 'test 1.1');
    assert(result.tests[3].suite.title === 'suite 1');

    done();
  });
});

t('multiple errors', function(done) {
  run('multiple-errors.js', function(result) {
    assert(result.passed === 2, 'passed test: ' + result.passed);
    assert(result.failed === 1, 'failed tests: ' + result.failed);
    done();
  });
});
