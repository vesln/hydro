var Test = require('../lib/hydro/test');

test('Async detection', function() {
  var async = new Test('test', function(done){});
  var sync = new Test('test', function(){});

  async.async.should.be.true;
  sync.async.should.be.false;
});

test('Failing a test', function() {
  var test = new Test('test', function(){});
  var err = new Error('test');

  test.fail(err);

  test.failed.should.be.true;
  test.error.should.eql(err);
});

test('Capturing execution time', function(done) {
  var test = new Test('test', function(done) {
    setTimeout(done, 10);
  });

  test.run(function() {
    test.captureTime();
    test.time.should.be.greaterThan(9);
    done();
  });
});

test('Running async test', function(done) {
  var error = new Error('test');
  var test = new Test('test', function(next) {
    next(error);
  });

  test.run(function(err) {
    err.should.eql(error);
    test.failed.should.be.true;
    done();
  });
});

test('Running sync test', function(done) {
  var error = new Error('test');
  var test = new Test('test', function(next) {
    throw error;
  });

  test.run(function(err) {
    err.should.eql(error);
    test.failed.should.be.true;
    done();
  });
});
