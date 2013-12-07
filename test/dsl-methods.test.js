var Hydro = require('..');

suite('DSL methods', function() {
  test('Attaching to the default target', function() {
    var hydro = new Hydro;
    hydro.addMethod('testFoo', 'bar');
    hydro.run({}, function() {
      global.testFoo.should.eq('bar');
      delete global.testFoo;
    });
  });

  test('Attaching to supplied object', function() {
    var hydro = new Hydro;
    var obj = Object.create(null);

    hydro.attach(obj);
    hydro.addMethod('foo', 'bar');
    hydro.run({}, function() {
      obj.foo.should.eq('bar');
    });
  });
});
