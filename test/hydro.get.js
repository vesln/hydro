t('get with unkonwn key', function() {
  var hydro = new Hydro;
  assert('undefined' === typeof hydro.get('unknown'));
});

t('get for key that has value', function() {
  var hydro = new Hydro;
  hydro.set('foo', 'bar');
  assert(hydro.get('foo') === 'bar');
});
