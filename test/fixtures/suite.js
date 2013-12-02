var test = require('../..');
var suite = test.suite;
var it = test;
var describe = suite;

describe('a', function() {
  it('a-test-1', function(){});
  it('a-test-2', function(){});
});

suite('b');

test('b-test-1', function(){});
test('b-test-2', function(){});
