t('set with config key and val', function() {
  var hydro = new Hydro;
  hydro.set('foo', 'bar');
  assert(hydro.get('foo') === 'bar');
});

t('set with config key, prop and val', function() {
  var hydro = new Hydro;
  hydro.set('globals', 'prop', 'bar');
  assert(hydro.get('globals').prop === 'bar');
});

t('set with config key, pop and val when where config key is undefined', function() {
  var hydro = new Hydro;
  hydro.set('custom', 'prop', 'bar');
  assert(hydro.get('custom').prop === 'bar');
});
