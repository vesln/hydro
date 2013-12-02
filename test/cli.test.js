test('--version', function(done) {
  cli()
  .stdout(require('../package.json').version)
  .run('--version')
  .end(done);
});

test('--help', function(done) {
  cli()
  .stdout(/Usage: hydro \[debug\] \[files\]/)
  .run('--help')
  .end(done);
});
