var test = require('../..');
var assert = require('assert');

test('Sync', function() {
  assert(true);
});

test('Async', function(done) {
  process.nextTick(function() {
    done();
  });
});

test('Another sync', function() {
  assert(true);
});
