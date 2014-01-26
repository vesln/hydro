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
  hydro.run();
});

t('before', function(done) {
  var hydro = new Hydro;
  var count = 0;
  hydro.addSuite('suite', function(){
    hydro.interface.before(function() { count++; });
    hydro.addTest('one', function() {
      assert(count === 1);
    });
    hydro.addTest('two', function(){
      assert(count === 2);
    });
    hydro.addSuite('inner suite', function() {
      hydro.addTest('three', function(){
        assert(count === 3);
        done();
      });
    });
  });
  hydro.run();
});

t('beforeAll', function(done) {
  var hydro = new Hydro;
  var called = false;
  hydro.addSuite('suite', function(){
    hydro.addTest('one', function() {
      assert(called);
      done();
    });
    hydro.interface.beforeAll(function() { called = true; });
  });
  hydro.run();
});
