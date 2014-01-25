t('beforeNext', function(done) {
  var hydro = new Hydro;
  var called = false;
  hydro.addSuite('suite', function() {
    hydro.interface.beforeNext(function() { called = true; });
    hydro.addTest('beforeNext', function(done) {
      assert(called);
      done();
    });
  });
  hydro.run(done);
});

t('afterNext', function(done) {
  var hydro = new Hydro;
  var called = false;
  hydro.addSuite('suite', function(){
    hydro.interface.afterNext(function() {
      assert(!called, 'should not be called twice')
      called = true;
    });
    hydro.addTest('afterNext', function() {
      assert(!called);
    });
    hydro.addTest('another test', function(){
      assert(called);
      done();
    });
  });
  hydro.run(done);
});
