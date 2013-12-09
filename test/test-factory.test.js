var create = Hydro.Test.create;
var fn = function(){};

s('Test#create', function() {
  t('test creation without meta', function() {
    var a = create(null, ['foo']);
    var b = create(null, ['foo', fn]);

    a.title.should.eq('foo');
    b.title.should.eq('foo');

    should.not.exist(a.fn);
    b.fn.should.eq(fn);
  });

  t('test creation with meta and without body', function() {
    var test = create(null, ['foo', 'bar', 'baz']);

    test.title.should.eq('foo');
    test.meta.should.eql(['bar', 'baz']);
  });

  t('test creation with meta and with body', function() {
    var test = create(null, ['foo', 'bar', 'baz', fn]);

    test.title.should.eq('foo');
    test.fn.should.eql(fn);
    test.meta.should.eql(['bar', 'baz']);
  });
});
