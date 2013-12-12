var inherits = require('super');
var Suite = require('./index');

function RootSuite() {
  Suite.call(this);

  this.events = {
    pre: 'pre:all',
    post: 'post:all',
  };
}

inherits(RootSuite, Suite);

RootSuite.prototype.addTest = function() {
  throw new Error('Please register a test suite');
};

module.exports = RootSuite;
