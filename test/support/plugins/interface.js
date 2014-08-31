/**
 * Set UI proxies.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.set('proxies', 's', 'addSuite');
  hydro.set('proxies', 't', 'addTest');
};
