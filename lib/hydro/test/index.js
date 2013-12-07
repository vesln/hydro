/**
 * Internal dependencies.
 */

var SyncTest = require('./sync');
var AsyncTest = require('./async');

/**
 * Test factory.
 *
 * @param {String} title
 * @param {Array} meta [optional]
 * @param {Function} test
 * @param {Suite} test suite
 * @api public
 */

exports.create = function(title, meta, fn, suite) {
  if (!fn && 'function' === typeof meta) {
    fn = meta;
    meta = null;
  }

  var klass = (fn && fn.length) ? AsyncTest : SyncTest;
  return new klass(title, fn, meta, suite);
};
