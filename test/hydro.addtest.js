t('add tests', function() {
  var hydro = new Hydro;
  hydro.addSuite('suite 1', function() {
    hydro.addTest('test 1.1');
    hydro.addSuite('suite 2', function() {
      hydro.addTest('test 2.1');
    });
  });

  var tests = hydro.tests();
  assert(tests[0].title === 'test 1.1');
  assert(tests[1].title === 'test 2.1');
});

t('add a test without a suite', function() {
  var hydro = new Hydro;
  var err = null;

  try {
    hydro.addTest('foo', 'bar');
  } catch(e) {
    err = e;
  }

  assert(err.message === 'Please add a test suite');
});
