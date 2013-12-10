var DoubleRunner = require('./support/double-runner');

t('Runner contract', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro(runner);
  var fn = function(){};

  hydro.run(fn);

  assert(runner.ran === fn);
  assert(runner.events === hydro.events);
});

t('no params', function() {
  Hydro(new DoubleRunner).run();
});
