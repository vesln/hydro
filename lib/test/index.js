/**
 * Dependencies.
 */

var SyncTest = require('./sync');
var AsyncTest = require('./async');

/**
 * Test factory.
 *
 * @param {Array} [title, meta, fn]
 * @returns {Base} test
 * @api public
 */

exports.create = function(params) {
  var title = params.shift();
  var fn = null;
  var klass = null;
  if (typeof params[params.length - 1] === 'function') fn = params.pop();
  klass = (fn && fn.length) ? AsyncTest : SyncTest;
  return new klass(title, fn, params);
};
