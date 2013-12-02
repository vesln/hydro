var fixtures = require('path').join(__dirname, 'fixtures');

test('Passing tests', function(done) {
  cli()
  .stdout(/3 passed/)
  .stdout(/0 failed/)
  .run(fixtures + '/passing.js')
  .code(0)
  .end(done);
});

test('Failing tests', function(done) {
  cli()
  .stdout(/0 passed/)
  .stdout(/5 failed/)
  .run(fixtures + '/failing.js')
  .code(5)
  .end(done);
});
