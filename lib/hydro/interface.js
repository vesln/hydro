/**
 * Internal dependencies.
 */

var util = require('./util');

/**
 * Public interface for proxy methods.
 *
 * @param {Hydro} hydro
 * @constructor
 */

function Interface(hydro) {
  this.hydro = hydro;
}

/**
 * Delegate to Hydro.
 */

util.forEach(['addTest', 'addSuite', 'createTest', 'createSuite'], function(method) {
  Interface.prototype[method] = function() {
    return this.hydro[method].apply(this.hydro, arguments);
  };
});

/**
 * Primary export.
 */

module.exports = Interface;
