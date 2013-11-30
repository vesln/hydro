var out = process.stdout;
var tests = [];

function Formatter() {
}

Formatter.prototype.start = function(tests) {
  console.log('Running %d tests', tests.length);
  console.log('');
};

Formatter.prototype.before = function(test) {
  console.log(test.title);
};

Formatter.prototype.after = function(err) {
  console.log(err ? 'ERROR' : 'OK');
};

Formatter.prototype.end = function() {
  console.log('');
  console.log('Done');
};

function Runner() {
  this.tests = [];
  this.formatter = new Formatter;
}

Runner.prototype.test = function(title, fn) {
  this.tests.push({
    async: fn.length === 1,
    title: title,
    fn: fn
  });
};

Runner.prototype.run = function() {
  var tests = this.tests.slice(0);
  var formatter = this.formatter;
  var test = null;
  var ready = false;

  formatter.start(this.tests);

  function error(err) {
    formatter.after(err);
    next();
  }

  process.on('uncaughtException', error);

  function end() {
    process.removeListener('uncaughtException', error);
    formatter.end();
  }

  function done(err) {
    if (ready) return;
    ready = true;
    formatter.after(err);
    next();
  }

  function next() {
    var err = null;
    ready = false;
    test = tests.shift();

    if (!test) return end();

    formatter.before(test);

    try {
      test.fn(done);
    } catch (e) {
      err = e;
    }

    if (!test.async || err) {
      done(err);
    }
  }

  next();
};

var runner = new Runner;

module.exports = function test(title, fn) {
  runner.test(title, fn);
};

module.exports.run = function() {
  runner.run();
};
