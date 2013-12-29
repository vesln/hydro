t('plugins as functions', function(done) {
  var hydro = new Hydro;
  hydro.set('plugins', [plugin]);
  hydro.run();
  function plugin(_hydro) {
    assert(_hydro === hydro)
    done();
  }
});

t('plugins as modules', function(done) {
  var hydro = new Hydro;
  var path = __dirname + '/support/fixtures/plugin';
  var plugin = require(path);
  hydro.set('plugins', [path]);
  hydro.run();
  assert(plugin.called);
  plugin.called = false;
  done();
}).skip(typeof window !== 'undefined' || typeof __testlingErrorHandler !== 'undefined');
