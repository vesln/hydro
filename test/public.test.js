var Hydro = require('..');
var DoubleRunner = require('./support/double-runner');

suite('Public interface', function() {
  test('Add test proxy', function() {
    var runner = new DoubleRunner;
    var hydro = new Hydro(runner);

    hydro.addTest('foo', 'bar');

    runner.tests.should.have.lengthOf(1);
    runner.tests[0][0].should.eq('foo');
    runner.tests[0][1].should.eq('bar');
  });

  test('Add suite proxy', function() {
    var runner = new DoubleRunner;
    var hydro = new Hydro(runner);

    hydro.addSuite('foo', 'bar');

    runner.suites.should.have.lengthOf(1);
    runner.suites[0][0].should.eq('foo');
    runner.suites[0][1].should.eq('bar');
  });

  test('Running the tests', function() {
    var runner = new DoubleRunner;
    var hydro = new Hydro(runner);
    var fn = function(){};

    hydro.run(fn);

    runner.ran.should.eql(fn);
    runner.events.should.eql(hydro.events);
  });
});
