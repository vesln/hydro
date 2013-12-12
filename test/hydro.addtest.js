t('adding a test without a suite', function() {
  var hydro = new Hydro;
  var err = null;

  try {
    hydro.addTest('foo', 'bar');
  } catch(e) {
    err = e;
  }

  assert(err.message === 'Please register a test suite');
});
