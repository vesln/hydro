var _ = Hydro.util;

t('isString', function() {
  assert(_.isString('str'));
  assert(_.isString(new String('foo')));
  assert(_.isString(String('foo')));

  assert.not(_.isString({}));
  assert.not(_.isString(/foo/));
  assert.not(_.isString(true));
  assert.not(_.isString(null));
  assert.not(_.isString(undefined));
});

t('isArray native', function() {
  assert(_.isArray([]));
  assert.not(_.isArray({}));
});

t('isArray custom', function() {
  assert(_.isArray([]));
  assert.not(_.isArray({}));
});

t('toArray', function() {
  var arr = [];
  assert(_.toArray(arr) === arr);
  assert(_.toArray('foo')[0] === 'foo');
});

t('forEach', function() {
  var arr = [1, 2 ,3];
  var actual = [];

  _.forEach(arr, function(i) {
    actual.push(i);
  });

  assert(arr[0] == actual[0]);
  assert(arr[1] == actual[1]);
  assert(arr[2] == actual[2]);
});
