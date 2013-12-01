var Result = require('../lib/mini/result');
var Test = require('../lib/mini/test');
var noop = function(){};

test('#failed', function() {
  var failed = new Test('foo', noop);
  failed.fail();
  var tests = [failed, failed];
  var result = new Result(tests);

  result.failed.length.should.eq(2);
  result.failed.should.eql(tests);
});

test('#passed', function() {
  var passed = new Test('foo', noop);
  var tests = [passed, passed];
  var result = new Result(tests);

  result.passed.length.should.eq(2);
  result.passed.should.eql(tests);
});

test('#tests', function() {
  var test = new Test('foo', noop);
  var tests = [test, test];
  var result = new Result(tests);

  result.tests.length.should.eq(2);
  result.tests.should.eql(tests);
});
