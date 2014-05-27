t('add tests', function() {
  var hydro = new Hydro;
  hydro.addTest('test 0', function(){});
  hydro.addSuite('suite 1', function() {
    hydro.addTest('test 1.1');
    hydro.addSuite('suite 2', function() {
      hydro.addTest('test 2.1');
    });
  });

  var tests = hydro.tests();
  assert(tests[1].title === 'test 1.1');
  assert(tests[2].title === 'test 2.1');
});
