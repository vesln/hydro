t('add suites', function() {
  var hydro = Hydro();

  hydro.addSuite('suite 1', function() {
    hydro.addSuite('suite 2', function() {});
  });

  var suites = hydro.suites();

  assert(suites[1].title === 'suite 1');
  assert(suites[2].title === 'suite 2');
});

t('add suite without a body', function() {
  var hydro = Hydro();

  hydro.addSuite('suite 1');
  hydro.addSuite('suite 2');

  var suites = hydro.suites();

  assert(suites[1].title === 'suite 1');
  assert(typeof suites[1].parent.title === 'undefined');
  assert(suites[2].title === 'suite 2');
  assert(typeof suites[2].parent.title === 'undefined');
});

t('add suite with named function as a title', function() {
  var testSuite = function TestSuite() {};
  var hydro = Hydro();

  hydro.addSuite(testSuite);
  var suites = hydro.suites();

  assert(suites[1].title === 'TestSuite', 'bad title: ' + suites[1].title);
});
