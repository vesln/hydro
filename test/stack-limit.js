t('stack limit', function() {
  var hydro = new Hydro;
  hydro.set('stackLimit', 4);
  hydro.setup();
  assert(Error.stackTraceLimit === 4);
});
