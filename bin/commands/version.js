/**
 * Show module version.
 *
 * @api public
 */

module.exports = function() {
  console.log(require('../../package.json').version);
};
