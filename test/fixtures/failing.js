var test = require('../..');
var assert = require('assert');

test('Async throw', function(done) {
  setTimeout(function() {
    throw new Error('Foo');
  }, 40);
});

test('Sync', function() {
  assert(false);
});

test('Async', function(done) {
  process.nextTick(function() {
    done(new Error('Invalid'));
  });
});

test('Timeout', function(done) {
  setTimeout(function() {
    done(new Error('Invalid'));
  }, 40);
});

test('Throws', function(done) {
  throw new Error('bad');
});
