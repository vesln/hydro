t('default target', function() {
  var hydro = new Hydro;
  hydro.addMethod('testFoo', 'bar');
  hydro.run(function() {
    global.testFoo.should.eq('bar');
    delete global.testFoo;
  });
});

t('custom target', function() {
  var hydro = new Hydro;
  var obj = {};

  hydro.attach(obj);
  hydro.addMethod('foo', 'bar');
  hydro.run(function() {
    obj.foo.should.eq('bar');
  });
});
