/**
 * Dependencies.
 */

var SyncTest = require('./sync');
var AsyncTest = require('./async');
var _ = require('../util');

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
  var meta = {};
  var klass = null;

  if (_.isObject(params[0])) meta = params[0];
  if (_.isFn(params[params.length - 1])) fn = params.pop();

  klass = (fn && fn.length) ? AsyncTest : SyncTest;
  return new klass(title, fn, meta);
};
