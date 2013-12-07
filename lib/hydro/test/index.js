/**
 * Internal dependencies.
 */

var SyncTest = require('./sync');
var AsyncTest = require('./async');

/**
 * Test factory.
 *
 * @param {String} title
 * @param {Array} tags [optional]
 * @param {Function} test
 * @param {Suite} test suite
 * @api public
 */

exports.create = function(title, tags, fn, suite) {
  if (!fn && 'function' === typeof tags) {
    fn = tags;
    tags = null;
  }

  var klass = (fn && fn.length) ? AsyncTest : SyncTest;
  return new klass(title, fn, tags, suite);
};
