var assert = require('assert');

t('Sync', function() {
  assert(true);
});

t('Async', function(done) {
  process.nextTick(function() {
    done();
  });
});

t('Another sync', function() {
  assert(true);
});
