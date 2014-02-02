[![NPM
version](https://badge.fury.io/js/hydro.png)](http://badge.fury.io/js/hydro)
[![Build Status](https://secure.travis-ci.org/hydrojs/hydro.png)](http://travis-ci.org/hydrojs/hydro)

# hydro

Teeny-weeny test runner for Node.js

## Quick start guide

1. Install `hydro` and any plugins you might want to use with NPM.
   (Suggestions: install a basic test reporter, like
   [`hydro-bdd`](https://github.com/hydrojs/hydro-bdd) or
   [`hydro-tdd`](https://github.com/hydrojs/hydro-tdd).)
   
    ```bash
    npm install --save-dev hydro hydro-bdd
    ```

2. Create a `hydro.conf.js` file in the root of your project.

    ```javascript
    var assert = require('assert');
    module.exports = function(hydro) {
      hydro.set({
        attach: global,
        suite: 'My test suite',
        formatter: 'hydro-simple',
        plugins: ['hydro-bdd'],
        tests: ['./test/*.js'],
        globals: { assert: assert }
      });
    }
    ```

3. Write some tests in the directory you pointed to.

    ```javascript
    describe('A basic test', function() {
      it('should allow for assertions', function() {
        assert(true);
      });
    });
    ```
    
4. Now run your test from the root directory of your project!

    ```bash
    ./node_modules/.bin/hydro
    ```

## Authors

- [Veselin Todorov](https://github.com/vesln)
- [Jake Rosoman](https://github.com/jkroso)
- [Jake Luer](https://github.com/logicalparadox)

## License

The MIT License (see LICENSE)
