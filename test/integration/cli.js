var join = require('path').join;
var nixt = require('nixt');
var bin = join(__dirname, '..', '..', 'bin');

t('--version', function(done) {
  cli()
  .stdout(require('../../package.json').version)
  .run('--version')
  .code(0)
  .end(done);
});

t('--help', function(done) {
  cli()
  .stdout(/Usage: hydro \[debug\] \[options\]/)
  .run('--help')
  .code(0)
  .end(done);
});

t('--plugins', function(done) {
  cli()
  .stdout(/fixturePlugin is set to 1/)
  .run('--plugins ' + fixturePath('plugin.js') + ' ' + fixturePath('ensure-plugin-loaded.js'))
  .code(0)
  .end(done);
});

t('two --plugins', function(done) {
  cli()
  .stdout(/fixturePlugin is set to 2/)
  .run('--plugins ' + fixturePath('plugin.js') + ' --plugins ' + fixturePath('plugin.js') + ' ' + fixturePath('ensure-plugin-loaded.js'))
  .code(0)
  .end(done);
});

function cli() {
  return nixt({ newlines: false }).cwd(bin).base('./hydro ');
}

function fixturePath(fileName) {
  return join(__dirname, '..', 'support', 'fixtures', fileName);
}
