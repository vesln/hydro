t('plugin invocation', function(done) {
  var hydro = new Hydro;
  hydro.set('plugins', [plugin]);
  hydro.run();
  function plugin(_hydro) {
    _hydro.should.eq(hydro);
    done();
  }
});
