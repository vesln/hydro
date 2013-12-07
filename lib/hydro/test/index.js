/**
 * Internal dependencies.
 */

var SyncTest = require('./sync');
var AsyncTest = require('./async');

/**
 * Test factory.
 *
 * @param {Suite} test suite
 * @param {Array} [title, meta, fn]
 * @returns {Base} test
 * @api public
 */

exports.create = function(suite, params) {
  var title = params.shift();
  var fn = null;

  if (typeof params[params.length -1] === 'function') {
    fn = params.pop();
  }

  var klass = (fn && fn.length) ? AsyncTest : SyncTest;
  return new klass(title, fn, params, suite);
};
