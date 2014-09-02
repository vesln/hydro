t('create suite', function() {
  var suite = Hydro().interface.createSuite('foo');
  assert(suite.title === 'foo');
});
