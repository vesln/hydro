t('traverse', function() {
  var tests = [];
  var enter = [];
  var leave = [];
  var hydro = new Hydro;

  hydro.addSuite('suite 1', function() {
    hydro.addSuite('suite 2', function() {
      hydro.addTest('test 2.1');
    });
    hydro.addTest('test 1.1');
  });

  hydro.traverse({
    enterSuite: function(suite) {
      enter.push(suite);
    },
    leaveSuite: function(suite) {
      leave.push(suite);
    },
    test: function(test) {
      tests.push(test);
    }
  });

  assert(enter[0].title === undefined); // root suite
  assert(enter[1].title === 'suite 1');
  assert(enter[2].title === 'suite 2');

  assert(tests[0].title === 'test 2.1');
  assert(tests[1].title === 'test 1.1');

  assert(leave[0].title === 'suite 2');
  assert(leave[1].title === 'suite 1');
  assert(leave[2].title === undefined); // root suite
});
