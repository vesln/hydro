var test = require('..');

test('--version', function(done) {
  cli()
  .stdout(require('../package.json').version)
  .run('--version')
  .end(done);
});

test('--help', function(done) {
  cli()
  .stdout(/Usage: mini <path-to-tests>/)
  .run('--help')
  .end(done);
});

test('--formatters', function(done) {
  cli()
  .stdout(/list\s*noop/)
  .run('--formatters')
  .end(done);
});
