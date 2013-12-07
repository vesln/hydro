function DoubleRunner() {
  this.tests = [];
  this.suites = [];
}

DoubleRunner.prototype.configure = function(options, fn) {
  this.options = options;
  fn();
};

DoubleRunner.prototype.loadFormatter = function() {
  this.formatterLoaded = true;
};

DoubleRunner.prototype.loadTests = function() {
  this.testsLoaded = true;
};

DoubleRunner.prototype.run = function(fn) {
  this.ran = fn;
};

DoubleRunner.prototype.test = function() {
  this.tests.push([].slice.call(arguments));
};

DoubleRunner.prototype.suite = function() {
  this.suites.push([].slice.call(arguments));
};

module.exports = DoubleRunner;
