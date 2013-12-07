function DoubleRunner() {
  this.tests = [];
  this.suites = [];
}

DoubleRunner.prototype.configure = function(options, fn) {
  this.options = options;
  fn();
};

DoubleRunner.prototype.run = function(events, fn) {
  this.events = events;
  this.ran = fn;
};

DoubleRunner.prototype.addTest = function() {
  this.tests.push([].slice.call(arguments));
};

DoubleRunner.prototype.addSuite = function() {
  this.suites.push([].slice.call(arguments));
};

module.exports = DoubleRunner;
