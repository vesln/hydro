var hydro = new Hydro;
var fn = function(){};

t('test creation without meta', function() {
  var a = hydro.createTest('foo');
  var b = hydro.createTest('foo', fn);

  assert(a.title === 'foo');
  assert(b.title === 'foo');

  assert(a.fn === null);
  assert(b.fn === fn);
});

t('test creation with meta and without body', function() {
  var test = hydro.createTest('foo', { foo: 'bar' });

  assert(test.title === 'foo');
  assert(test.meta.foo === 'bar');
});

t('test creation with meta and with body', function() {
  var test = hydro.createTest('foo', { foo: 'bar' }, fn);

  assert(test.title === 'foo');
  assert(test.fn === fn);
  assert(test.meta.foo === 'bar');
});

t('setting test timeout', function() {
  hydro.set('timeout', 42);
  var test = hydro.createTest('foo', 'bar', 'baz', fn);
  assert(test._timeout === 42);
});
