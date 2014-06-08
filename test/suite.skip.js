t('should skip all child tests', function() {
  var hydro = new Hydro;

  hydro.addSuite('suite', function() {
    hydro.addTest('skip me', function(){});
  }).skip();

  assert(hydro.tests()[0].status == 'skipped');
});

t('support conditional', function(){
  var hydro = new Hydro;

  hydro.addSuite('a', function() {
    hydro.addTest('skip me', function(){});
  }).skip(true);

  hydro.addSuite('b', function() {
    hydro.addTest('don\'t skip me', function(){});
  }).skip(false);

  assert(hydro.tests()[0].status == 'skipped');
  assert(hydro.tests()[1].status == null);
});
