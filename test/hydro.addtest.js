var DoubleRunner = require('./support/double-runner');

t('Runner delegation', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  hydro.addTest('foo', 'bar');

  assert(runner.tests.length === 1);
  assert(runner.tests[0][0] === 'foo');
  assert(runner.tests[0][1] === 'bar');
});

t('adding a test without a suite', function() {
  var hydro = new Hydro;
  var err = null;

  try {
    hydro.addTest('foo', 'bar');
  } catch(e) {
    err = e;
  }

  assert(err.message === 'Please register a test suite');
});
