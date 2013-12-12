t('subscribing to events', function(done) {
  var fixtures = require('path').join(__dirname, 'support', 'fixtures');
  var hydro = new Hydro;
  var called = false;

  hydro.on('pre:file', function() {
    called = true;
  });

  hydro.push('tests', fixtures + '/blank.js');

  hydro.run(function() {
    assert(called);
    done();
  });

}).skip(typeof window !== 'undefined');

t('subscribing to events', function(done) {
  var hydro = new Hydro;
  var called = false;

  hydro.on('pre:file', function() {
    called = true;
  });

  hydro.push('tests', '../fixtures/blank.js');

  hydro.run(function() {
    assert(called);
    done();
  });
}).skip(typeof window === 'undefined');
