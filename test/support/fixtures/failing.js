describe('Faling tests', function() {
  it('Async throw', function(done) {
    setTimeout(function() {
      throw new Error('test');
    }, 3);
  });

  it('Sync', function() {
    throw new Error('test');
  });

  it('Async', function(done) {
    process.nextTick(function() {
      done(new Error('test'));
    });
  });

  it('Timeout', function(done) {
    setTimeout(function() {
      done(new Error('Timeout'));
    }, 3);
  });

  it('Throws', function(done) {
    throw new Error('bad');
  });
});

