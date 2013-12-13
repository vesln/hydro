t('test parent suites', function() {
  var hydro = Hydro();
  var test = null;

  hydro.addSuite('suite 1', function() {
    hydro.addSuite('suite 2', function() {
      test = hydro.addTest('test 1');
    });
  });

  var parents = test.parents();
  assert(parents[0].title === undefined);
  assert(parents[1].title === 'suite 1');
  assert(parents[2].title === 'suite 2');
});
