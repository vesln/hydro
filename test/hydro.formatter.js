t('formatter as function', function(done) {
  var hydro = new Hydro;
  var called = false;

  hydro.set('formatter', function() { called = true; });

  hydro.run(function() {
    assert(called);
    done();
  });
});

t('formatter as string', function(done) {
  var hydro = new Hydro;
  hydro.set('formatter', 'hydro-silent');
  hydro.run(function() {
    done();
  });
}).skip(typeof window !== 'undefined');
