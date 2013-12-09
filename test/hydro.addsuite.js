var DoubleRunner = require('./support/double-runner');

s('Hydro#addSuite', function() {
  t('Runner delegation', function() {
    var runner = new DoubleRunner;
    var hydro = new Hydro(runner);

    hydro.addSuite('foo', 'bar');

    runner.suites.should.have.lengthOf(1);
    runner.suites[0][0].should.eq('foo');
    runner.suites[0][1].should.eq('bar');
  });
});
