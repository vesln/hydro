/**
 * Internal dependencies.
 */

var Dispatcher = require('./hydro/dispatcher');

/**
 * Test dispatcher.
 */

var dispatcher = new Dispatcher;

/**
 * Primary export.
 */

module.exports = function() {
  dispatcher.test.apply(dispatcher, arguments);
};

/**
 * Export `dispatcher`.
 */

module.exports.dispatcher = dispatcher;

/**
 * Export DSL methods.
 */

['skip', 'suite', 'on'].forEach(function(method) {
  module.exports[method] = function() {
    dispatcher[method].apply(dispatcher, arguments);
  };
});
