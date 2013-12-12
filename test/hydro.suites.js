t('suite count', function() {
  var hydro = Hydro();

  hydro.addSuite('suite 1', function() {
    hydro.addSuite('suite 1.1', function(){});
  });

  hydro.addSuite('suite 2', function(){});
  hydro.addSuite('suite 3', function(){});

  assert(hydro.suites().length === 5); // 4 + the root suite
});
