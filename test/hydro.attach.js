t('specify attach target', function() {
  var hydro = new Hydro;
  var obj = {};
  hydro.set('attach', obj);

  hydro.addMethod('foo', 'bar');
  hydro.run(function() {
    assert(obj.foo === 'bar');
  });
});
