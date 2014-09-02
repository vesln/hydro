t('specifying global target', function(done) {
  var hydro = new Hydro;
  var obj = {};

  hydro.set('global', obj);
  hydro.set('globals', { foo: 'bar' });

  hydro.run(function() {
    assert(obj.foo === 'bar');
    done();
  });
});
