t('create suite', function() {
  var suite = Hydro().createSuite('foo');
  assert(suite.title === 'foo');
});
