describe('Passing tests', function() {
  it('Sync', function() {});

  it('Async', function(done) {
    setTimeout(done, 4)
  });

  it('Another sync', function() {});
});
