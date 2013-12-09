var DoubleRunner = require('./support/double-runner');

t('Runner delegation', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  hydro.addTest('foo', 'bar');

  runner.tests.should.have.lengthOf(1);
  runner.tests[0][0].should.eq('foo');
  runner.tests[0][1].should.eq('bar');
});
