
var tryc = require('tryc');

t('no params', function() {
  Hydro().run();
});

t('error handling', function(done) {
  var hydro = new Hydro;

  hydro.on('pre:all', function() {
    throw new Error('boom');
  });

  hydro.run(function(err) {
    assert(err != null);
    assert(err.message == 'boom');
    done();
  });
});

t('throw error if there is no callback', function(done) {
  var hydro = new Hydro;

  hydro.on('pre:all', function() {
    throw new Error('boom');
  });

  tryc(function(){
    hydro.run();
  }, function(err){
    assert(err instanceof Error);
    assert(/boom/.test(err.message));
    done();
  });
});
