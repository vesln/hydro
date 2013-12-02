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
 * Export DSL methods.
 */

['skip', 'run', 'suite'].forEach(function(method) {
  module.exports[method] = function() {
    dispatcher[method].apply(dispatcher, arguments);
  };
});
