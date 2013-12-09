var join = require('path').join;
var nixt = require('nixt');
var bin = join(__dirname, '..', '..', 'bin');

test('--version', function(done) {
  cli()
  .stdout(require('../../package.json').version)
  .run('--version')
  .end(done);
});

test('--help', function(done) {
  cli()
  .stdout(/Usage: hydro \[debug\] \[files\]/)
  .run('--help')
  .end(done);
});

function cli() {
  return nixt({ newlines: false }).cwd(bin).base('./hydro ');
}
