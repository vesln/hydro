var DoubleRunner = require('./support/double-runner');

t('Runner contract', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);
  var fn = function(){};

  hydro.run(fn);

  runner.ran.should.eql(fn);
  runner.events.should.eql(hydro.events);
});

t('no params', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);

  should.not.throw(function() {
    hydro.run();
  });
});
