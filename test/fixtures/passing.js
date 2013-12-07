s('Passing tests', function() {
  t('Sync', function() {});

  t('Async', function(done) {
    process.nextTick(function() {
      done();
    });
  });

  t('Another sync', function() {});
});
