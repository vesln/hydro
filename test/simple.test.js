var test = require('..');

test('Passing test', function() {
  true.should.eq(true);
});

test('Failing test', function() {
  true.should.eq(false);
});

test('Async', function(done) {
  process.nextTick(done);
});

test('Async throws', function(done) {
  process.nextTick(function() {
    throw new Error('bad');
  });
});

test('Async fail', function(done) {
  process.nextTick(function() {
    done(new Error('bad'));
  });
});
