
0.9.0 / 2014-01-26
==================

  * Update evts
  * Add interface tests
  * Implement hooks on interface
  * Add suite[before/after] hooks
  * Add error handling in test[before/after] hooks
  * Add per test before/after events

0.8.11 / 2014-01-21
==================

  * Export `Test` and `Suite`
  * Extract a new Interface class

0.8.10 / 2014-01-20
==================

  * Handle multiple uncaught errors

0.8.9 / 2014-01-18
==================

  * Fix function name detection on IE

0.8.8 / 2014-01-18
==================

  * Support named functions for suite titles
  * Use browserifyable tryc
  * Use new browserifyable fload
  * Include --setup in the help output
  * Fix browser detection

0.8.7 / 2013-12-23
==================

  * Node 0.11 compatible
  * use argvee instead of optimist

0.8.6 / 2013-12-22
==================

  * Start using `loa` and drop `instance`

0.8.5 / 2013-12-22
==================

  * `run` will setup the environment only if not done yet

0.8.4 / 2013-12-21
==================

  * Extract `run` into separate methods
  * Improve browser support

0.8.3 / 2013-12-15
==================

  * Optional attach target

0.8.2 / 2013-12-13
==================

  * Tests passing on >= IE 7
  * Allow adding a suite without a body
  * Add Test#parents
  * Supply the utils to plugins, similar to Chai.js
  * Do not expose internals

0.8.1 / 2013-12-13
==================

  * Allow tests to be skipped from a plugin
  * Downgrade evts

0.8.0 / 2013-12-13
==================

  * Introduce pending tests
  * Add traverse and other helper methods
  * Browser build
  * Docs
  * Make test symmetric to suite
  * Use some plugins
  * Introduce RootSuite
  * events -> emitter
  * Depend on instance
  * Tests
  * Simplify expected dependencies
  * Cache `Date` etc since modules like Timekeeper can modify it
  * Add more dev tasks

0.7.2 / 2013-12-11
==================

  * Add configurable timeout for async tests
  * Give the tests sync/async indicators
  * Don't suppress errors even if the test has ended
  * Include plugin flags in --help

0.7.1 / 2013-12-10
==================

  * Fix a bug with the proxy setup

0.7.0 / 2013-12-10
==================

  * Support plugins as modules
  * Add no-colors CLI option
  * The specified formatter can be a string, function or an object
  * Introduce `Hydro#push`
  * Improve the help command
  * Introduce globals
  * Introduce proxies
  * Initial browser support
  * Remove `attach`, specify with option
  * Remove `use`, add plugins with option
  * Add option for default suite

0.6.1 / 2013-12-07
==================

  * Introduce conditional test skipping
  * Tests run in their own context
  * Make the async test timeout configurable
  * tags -> meta
  * Add pre/post require test hooks

0.6.0 / 2013-12-07
==================

  * Add support for nested suites
  * Initial plugin support
  * Enable creation of DSL methods
  * Always require a test suite
  * Run async tests with domains
  * Move the callsite functionality to a plugin
  * Set `NODE_ENV` to test if none
  * Handle errors in the bootstrap file
  * Initial tag support

0.5.1 / 2013-12-03
==================

  * Fix some plugin hooks
  * Expose `_hydro`

0.5.0 / 2013-12-02
==================

 * Extract the base formatter and its related to a module
 * Change the default glob pattern to test/*.js
 * There is no need hydro-silent to be a core dependency
 * Initial plugin architecture
 * Introduce a test dispatcher
 * Suite is now running its tests
 * Move Formatter#displayGroup to the list formatter
 * Introduce skipped tests
 * bin: use v8-argv to allow harmony and other v8 args

0.4.0 / 2013-12-02
==================

  * Move all formatters outside of the module

0.3.0 / 2013-12-02
==================

  * mini -> hydro
  * Improve the result format
  * Export ms for formatters
  * Introduce a new default formatter
  * Remove --formatters

0.2.0 / 2013-12-01
==================

  * Introduce base formatter

0.1.2 / 2013-12-01
==================

  * Fix dependency mess

0.1.1 / 2013-12-01
==================

  * Expose the binary

0.1.0 / 2013-12-01
==================

  * Initial implementation
