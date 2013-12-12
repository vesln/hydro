t('root suite', function() {
  var hydro = new Hydro;

  hydro.set('suite', 'default');
  hydro.run();

  assert(hydro.suites()[1].title === 'default');
});
