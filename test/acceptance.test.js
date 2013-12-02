var fixtures = require('path').join(__dirname, 'fixtures');

test('Passing tests', function(done) {
  cli()
  .stdout(/3 tests, 0 failures/)
  .run(fixtures + '/passing.js')
  .code(0)
  .end(done);
});

test('Failing tests', function(done) {
  cli()
  .stdout(/5 failures/)
  .run(fixtures + '/failing.js')
  .code(5)
  .end(done);
});
