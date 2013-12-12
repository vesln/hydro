t('test count', function() {
  var hydro = Hydro();

  hydro.addSuite('root', function() {
    hydro.addTest('test 1');
    hydro.addTest('test 2');
    hydro.addTest('test 3');
  });

  assert(hydro.tests().length === 3);
});
