var Hydro = require('..');

test('plugins', function(done) {
  var hydro = new Hydro;
  hydro.use(plugin);
  hydro.run();

  function plugin(_hydro) {
    _hydro.should.eq(hydro);
    done();
  }
});
