var DoubleRunner = require('./support/double-runner');

test('add test proxy', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  hydro.addTest('foo', 'bar');

  runner.tests.should.have.lengthOf(1);
  runner.tests[0][0].should.eq('foo');
  runner.tests[0][1].should.eq('bar');
});

test('add suite proxy', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  hydro.addSuite('foo', 'bar');

  runner.suites.should.have.lengthOf(1);
  runner.suites[0][0].should.eq('foo');
  runner.suites[0][1].should.eq('bar');
});

test('running the tests', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);
  var fn = function(){};

  hydro.run(fn);

  runner.ran.should.eql(fn);
  runner.events.should.eql(hydro.events);
});

test('running the tests without a done callback', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  should.not.throw(function() {
    hydro.run();
  });
});
