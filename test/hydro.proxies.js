t('attaching a proxy', function(done) {
  var hydro = new Hydro;
  var target = {};

  hydro.set({
    global: target,
    proxies: { 't': 'addTest' }
  });

  hydro.run(function() {
    assert(target.t);
    done();
  });
});
