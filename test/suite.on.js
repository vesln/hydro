var Suite = require('../lib/hydro/suite');

t('before', function(done) {
  var called = false;
  var hydro = new Hydro;
  var suite = new Suite('hooks');
  suite.on('before', function(){ called = true; });
  suite.run(hydro.emitter, function(){
    assert(called);
    done();
  });
});

t('after', function(done) {
  var called = false;
  var hydro = new Hydro;
  var suite = new Suite('hooks');
  suite.on('after', function(){ called = true; });
  suite.run(hydro.emitter, function(){
    assert(called);
    done();
  });
});

s('error handling', function() {
  t('async before hook', function(done){
    var hydro = new Hydro;
    var suite = new Suite('hooks');
    var err = new Error('async before hook')
    suite.on('before', function(done){ done(err); });
    suite.run(hydro.emitter, function(error){
      assert(error === err);
      done();
    });
  });

  t('async after hook', function(done){
    var hydro = new Hydro;
    var suite = new Suite('hooks');
    var err = new Error('async after hook')
    suite.on('after', function(done){ done(err); });
    suite.run(hydro.emitter, function(error){
      assert(error === err);
      done();
    });
  });

  t('should propagate to the top', function(done) {
    var hydro = new Hydro;
    var err = new Error('propagate');
    hydro.addSuite(function suite(){}).on('before', function(){
      throw err;
    });
    hydro.run(function(error){
      assert(error === err);
      done();
    });
  });
});
