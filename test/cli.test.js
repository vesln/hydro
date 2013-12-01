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
  .expect(function(res) {
    var formatters = res.stdout.trim().replace(/ +(?= )/g, '').split(' ');
    formatters.should.have.members(['noop', 'list']);
  })
  .run('--formatters')
  .end(done);
});
