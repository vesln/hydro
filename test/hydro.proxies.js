t('attaching a proxy', function(done) {
  var hydro = new Hydro;
  var target = {};

  hydro.set({
    attach: target,
    proxies: { 't': 'addTest' }
  });

  hydro.run(function() {
    assert(target.t);
    done();
  });
});
