[![NPM
version](https://badge.fury.io/js/hydro.png)](http://badge.fury.io/js/hydro)
[![Build Status](https://secure.travis-ci.org/hydrojs/hydro.png)](http://travis-ci.org/hydrojs/hydro)
[![Code Climate](https://codeclimate.com/github/hydrojs/hydro.png)](https://codeclimate.com/github/hydrojs/hydro)

# hydro

Teeny-weeny test runner for Node.js

## Installation

```bash
$ npm install hydro
```

## Getting started

```js
var test = require('hydro');
var assert = require('assert');

// Sync

test('Great things', function() {
  assert(true === false);
});

// Async

test('Great things in the future', function(done) {
  done(assert(true === false));
});
```

## Run the tests

By default, hydro will search for test/*.test.js:

```bash
$ hydro
```

However, you can provide a custom pattern:

```bash
$ hydro spec/*.js
```

hydro can load a bootstrap file before requiring the tests. The default
location is `test/hydro.js`, but you can change it to whatever you wish:

```bash
$ hydro test/*.spec.js --setup test/bootstrap.js
```

### Test coverage

Test coverage with [Istanbul](https://github.com/gotwarlost/istanbul):

```bash
$ istanbul cover hydro -- --formatter noop
```

### Formatters

#### List - core

![hydro](http://f.cl.ly/items/1O1Z2o3H180p353u413k/hydro.png)

### Custom formatters

### Acknowledgements

hydro is heavily influenced by [minitest](https://github.com/seattlerb/minitest)
and [Mocha](https://github.com/visionmedia/mocha).

### Alternative projects

- [Mocha](https://github.com/visionmedia/mocha)
- [Jasmine](https://github.com/mhevery/jasmine-node)
- [node-tap](https://github.com/isaacs/node-tap)
- [Nodeunit](https://github.com/caolan/nodeunit)
- [Vows](https://github.com/cloudhead/vows)

## License

(The MIT License)

Copyright (c) 2013 Veselin Todorov <hi@vesln.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
