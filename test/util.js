var _ = require('../lib/util');

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

t('title', function() {
  var fn = function TestFunction() {};
  var str = 'title';

  assert.equal(_.title(fn), 'TestFunction');
  assert.equal(_.title(str), 'title');
});

t('delegate', function() {
  var called = false;
  var source = {};
  var target = {
    work: function() {
      called = true;
    }
  };

  _.delegate(source, target, [ 'work' ]);
  source.work();

  assert(called);
});
