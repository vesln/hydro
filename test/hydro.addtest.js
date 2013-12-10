var DoubleRunner = require('./support/double-runner');

t('Runner delegation', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  hydro.addTest('foo', 'bar');

  assert(runner.tests.length === 1);
  assert(runner.tests[0][0] === 'foo');
  assert(runner.tests[0][1] === 'bar');
});
