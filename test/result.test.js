var Result = require('../lib/hydro/result');
var Test = require('../lib/hydro/test');
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

test('#time', function() {
  var a = new Test('foo', noop);
  var b = new Test('foo', noop);
  var tests = [a, b];

  a.time = 10;
  b.time = 11;

  new Result(tests).time.should.eq(21);
});

test('#merge', function() {
  var passed = new Test('test', noop);
  passed.time = 10;

  var failed = new Test('test', noop);
  failed.time = 10;
  failed.fail();

  var result = new Result([ passed ]).merge(new Result([ failed ]));

  result.time.should.eq(20);
  result.tests.should.eql([ passed, failed ]);
  result.failed.should.eql([ failed ]);
  result.passed.should.eql([ passed ]);
});
