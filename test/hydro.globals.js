t('setting globals to target', function() {
  var hydro = new Hydro;
  var obj = {};

  hydro.set('attach', obj);
  hydro.push('plugins', plugin);

  hydro.run(function() {
    assert(obj.foo === 'bar');
  });

  function plugin(hydro) {
    hydro.set('globals', 'foo', 'bar');
  }
});
