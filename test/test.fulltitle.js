t('returns the full title', function() {
  var hydro = new Hydro;

  hydro.addSuite('suite 1', function() {
    hydro.addSuite('suite 2', function() {
      hydro.addTest('test', function() {});
    });
  });

  var test = hydro.tests()[0];

  assert(test.fullTitle() === 'suite 1 suite 2 test');
});
