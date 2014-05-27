t('before', function(done) {
  var called = false;
  var hydro = new Hydro;
  var test = new Hydro.Test.SyncTest('hooks', function() {});
  test.on('before', function(){
    called = true;
  });
  test.run(hydro.emitter, function(){
    assert(called);
    done();
  });
});

t('after', function(done) {
  var called = false;
  var hydro = new Hydro;
  var test = new Hydro.Test.AsyncTest('hooks', function(done) {
    setTimeout(done, 0);
  });
  test.on('after', function(){
    called = true;
  });
  test.run(hydro.emitter, function(){
    assert(called);
    done();
  });
});

t('should share context with the test body', function(done) {
  var hydro = new Hydro;
  var test = new Hydro.Test.SyncTest('hooks', function() {
    assert(this.sharesContext);
  });
  test.on('before', function(){
    this.sharesContext = true;
  });
  test.run(hydro.emitter, function(){
    assert(test.status == 'passed');
    done();
  });
});

s('error handling', function() {
  t('async before hook', function(done){
    var hydro = new Hydro;
    var test = new Hydro.Test.SyncTest('hooks', function() {});
    var err = new Error('async before hook')
    test.on('before', function(done){ done(err); });
    test.run(hydro.emitter, function(error){
      assert(error === err);
      done();
    });
  });

  t('async after hook', function(done){
    var hydro = new Hydro;
    var test = new Hydro.Test.SyncTest('hooks', function() {});
    var err = new Error('async after hook')
    test.on('after', function(done){ done(err); });
    test.run(hydro.emitter, function(error){
      assert(error === err);
      done();
    });
  });

  t('should propagate to the top', function(done) {
    var hydro = new Hydro;
    var err = new Error('propagate');
    hydro.addSuite('suite', function(){
      hydro.addTest('boom', function(){}).on('before', function(){
        throw err;
      });
    });
    hydro.run(function(error){
      assert(error === err);
      done();
    });
  });
});
