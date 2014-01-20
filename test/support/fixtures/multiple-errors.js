describe('multiple errors', function() {
  it('throws multiple errors', function(done) {
    for (var i = 0; i < 3; i++) {
      (function(ind) {
        setImmediate(function() {
          throw new Error('bad ' + ind);
        });
      })(i);
    }
  });

  it('passes 1', function(done) {
    setTimeout(done, 10);
  });

  it('passes 2', function(done) {
    setTimeout(done, 10);
  });
});
