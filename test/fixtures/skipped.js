s('Skipped tests', function() {
  t('Sync', function() {}).skip();
  t('second').skip();
  t('empty');
});
