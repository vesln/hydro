s('root', function() {
  t('test 0');

  s('suite 1', function() {
    t('test 1');

    s('suite 2', function() {
      t('test 2');
    });

    t('test 1.1');
  });
});
