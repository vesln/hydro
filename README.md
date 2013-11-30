[![NPM version](https://badge.fury.io/js/mini.png)](http://badge.fury.io/js/mini)
[![Build Status](https://secure.travis-ci.org/vesln/mini.png)](http://travis-ci.org/vesln/mini)
[![Code Climate](https://codeclimate.com/github/vesln/mini.png)](https://codeclimate.com/github/vesln/mini)

# mini

## Synopsis

Teeny-weeny test runner for Node.js

## Minimalistic example

```js
var test = require('mini');
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

## More complex example

Well, there isn't one.

## Test coverage

Test coverage with [Istanbul](https://github.com/gotwarlost/istanbul):

```bash
$ istanbul cover mini -- --formatter noop
```

## Installation

```bash
$ npm install mini
```

## Tests

### Running the tests

```bash
$ npm test
```

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
