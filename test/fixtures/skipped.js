s('Skipped tests', function() {
  t('skipped (explicit)', function() {}).skip();
  t('skipped (explicit)').skip();
  t('skipped (empty)');
  t('not skipped', function(){}).skip(false);
});
