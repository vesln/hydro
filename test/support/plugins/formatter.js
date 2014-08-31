/**
 * Dependencies
 */

var Printr = require('printr');
var color = require('eyehurt');

/**
 * Simple formatter.
 *
 * @param {Hydro} hydro
 * @constructor
 */

function Formatter(hydro) {
  if (!(this instanceof Formatter)) {
    return new Formatter(hydro);
  }

  this.printr = new Printr({ prefix: '   ' });
  this.tests = [];
  this.use(hydro);
}

/**
 * Subscribe to events.
 *
 * @param {Hydro} hydro
 * @api public
 */

Formatter.prototype.use = function(hydro) {
  hydro.on('pre:all', this.beforeAll.bind(this));
  hydro.on('post:test', this.afterTest.bind(this));
  hydro.on('post:all', this.afterAll.bind(this));
};

/**
 * Before all tests - tell the user that we
 * are about to run the tests.
 *
 * @api public
 */

Formatter.prototype.beforeAll = function() {
  this.printr.out.print('Running tests...');
  this.printr.out.print();
};

/**
 * After test - cache the test.
 *
 * @param {Test} test
 * @api public
 */

Formatter.prototype.afterTest = function(test) {
  this.tests.push(test);
};

/**
 * After all tests - print the results.
 *
 * @api public
 */

Formatter.prototype.afterAll = function() {
  var msg = null;
  var failed = this.tests.filter(function(test) {
    return test.status === 'failed';
  });

  // if no failures
  if (failed.length === 0) {
    msg = color('OK: ' + this.tests.length + ' tests', 'green');
    this.printr.out.println(msg);
    this.printr.out.println();
    return;
  }

  // if failures
  this.printr.out.println();

  failed.forEach(function(test, i) {
    var err = test.error.stack || test.error;
    this.printr.out.print(++i + ') ' + test.title);
    this.printr.out.print(color(err, 'red'));
    this.printr.out.print();
  }, this);

  msg = color(
    'NOT OK: '
    + failed.length + '/'
    + this.tests.length
    + ' tests', 'red'
  );

  this.printr.out.println(msg);
  this.printr.out.println();
};

/**
 * Primary export
 */

module.exports = Formatter;
