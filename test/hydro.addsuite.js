var DoubleRunner = require('./support/double-runner');

t('Runner delegation', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  hydro.addSuite('foo', 'bar');

  assert(runner.suites.length === 1);
  assert(runner.suites[0][0] === 'foo');
  assert(runner.suites[0][1] === 'bar');
});
