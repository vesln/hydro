t('push with existing config key and val', function() {
  var hydro = new Hydro;
  hydro.push('plugins', 'bar');
  assert(hydro.get('plugins')[0] === 'bar');
});

t('push with unexisting config key and val', function() {
  var hydro = new Hydro;
  hydro.push('custom', 'bar');
  assert(hydro.get('custom')[0] === 'bar');
});
