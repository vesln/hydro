describe('Passing tests', function() {
  it('Sync', function() {});

  it('Async', function(done) {
    process.nextTick(function() {
      done();
    });
  });

  it('Another sync', function() {});
});
