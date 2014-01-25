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
