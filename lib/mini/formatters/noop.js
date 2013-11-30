/**
 * Noop formatter.
 *
 * @constructor
 */

function Noop() {}

Noop.prototype.beforeAll =
Noop.prototype.afterAll =
Noop.prototype.beforeTest =
Noop.prototype.afterTest = function(){};

/**
 * Primary export.
 */

module.exports = Noop;
