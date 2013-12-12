var DoubleRunner = require('./support/double-runner');

t('Runner contract', function() {
  var runner = new DoubleRunner;
  var hydro = new Hydro;
  var fn = function(){};
  hydro.runner = runner;

  hydro.run(fn);

  assert(runner.ran === fn);
  assert(runner.emitter === hydro.emitter);
});

t('no params', function() {
  Hydro(new DoubleRunner).run();
});
