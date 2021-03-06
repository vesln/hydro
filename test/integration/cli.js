var join = require('path').join;
var nixt = require('nixt');
var basedir = join(__dirname, '..', '..');
var hydroExec = join(basedir, 'node_modules', '.bin', 'hydro');

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

t('--help with custom plugin paths', function(done) {
  cli()
  .stdout(/foo Bar/)
  .run('--help --plugins ' + fixturePath('plugin.js') + ' ' + fixturePath('ensure-plugin-loaded.js'))
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
  return nixt({ newlines: false })
    .cwd(basedir)
    .base(hydroExec + ' ');
}

function fixturePath(fileName) {
  return join(__dirname, '..', 'support', 'fixtures', fileName);
}
