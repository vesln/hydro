window.Hydro = require('hydro');
window.assert = function(expr, msg) {
  if (expr) return;
  throw new Error(msg || 'Assertion error');
};

hydro.setup();