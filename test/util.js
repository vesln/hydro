var _ = require('../lib/hydro/util');

t('isString', function() {
  assert(_.isString('str'));
  assert(_.isString(new String('foo')));
  assert(_.isString(String('foo')));

  assert(!_.isString({}));
  assert(!_.isString(/foo/));
  assert(!_.isString(true));
  assert(!_.isString(null));
  assert(!_.isString(undefined));
});

t('isArray native', function() {
  assert(_.isArray([]));
  assert(!_.isArray({}));
});

t('isArray custom', function() {
  assert(_.isArray([]));
  assert(!_.isArray({}));
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

t('eachKey', function() {
  function Klass(){}
  Klass.prototype.unknown = 3;
  var obj = new Klass;
  obj.prop = 'test';

  _.eachKey(obj, function(key, val) {
    assert(key === 'prop');
    assert(val === 'test');
  });
});

t('fnName', function() {
  var fn = function TestFunction() {};
  assert(_.fnName(fn) === 'TestFunction');
});
