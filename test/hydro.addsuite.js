t('add suites', function() {
  var hydro = new Hydro;

  hydro.addSuite('suite 1', function() {
    hydro.addSuite('suite 2', function() {});
  });

  var suites = hydro.suites();

  assert(suites[1].title === 'suite 1');
  assert(suites[2].title === 'suite 2');
});
