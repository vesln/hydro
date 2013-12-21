window.TESTLING = true;

var runner = Hydro();

function assert(expr, msg) {
  if (expr) return;
  throw new Error(msg || 'Assertion Failed');
}

runner.set({
  suite: 'Hydro',
  formatter: this['hydro-tap'],
  proxies: {
    t: 'addTest'
  }
});

runner.setup();

window.onload = function() {
  runner.exec();
};
