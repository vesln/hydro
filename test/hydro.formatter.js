t('formatter as object', function(done) {
  var hydro = new Hydro;
  var called = false;
  var formatter = {
    use: function() {
      called = true
    }
  };

  hydro.set('formatter', formatter);

  hydro.run(function() {
    assert(called);
    done();
  });
});

t('formatter as function', function(done) {
  var hydro = new Hydro;
  var called = false;

  function Formatter() {}
  Formatter.prototype.use = function() {
    called = true;
  };

  hydro.set('formatter', Formatter);

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
