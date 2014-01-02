# Run the tests on SauceLabs only when
# the current node version is the following:

SAUCE_NODE_VERSION = v0.10.

#
# Variables
#

MIN = hydro.min.js
KARMA = node_modules/.bin/karma
UGLIFY = node_modules/uglify-js/bin/uglifyjs
BROWSER = hydro.js
COV_EXEC = bin/_hydro
ISTANBUL = node_modules/.bin/istanbul
COVERALLS = node_modules/coveralls/bin/coveralls.js
COMPONENT_BUILD = node_modules/.bin/component-build
COMPONENT_INSTALL = node_modules/.bin/component-install

#
# All
#

all: install test

#
# Install
#

install: node_modules components build browser

#
# Browser build
#

browser: node_modules components
	@$(COMPONENT_BUILD) -s Hydro -o .
	@mv build.js $(BROWSER)
	@$(UGLIFY) $(BROWSER) --output $(MIN)

#
# Make a new development build
#

build: node_modules components
	@$(COMPONENT_BUILD) --dev
	@touch $@

#
# Run all tests
#

test: test-node test-browser

# Run the Node.js tests

test-node: node_modules
	@bin/hydro

#
# Run the browser tests
#

test-browser: test-component test-browserify

test-component: node_modules components build
	@KARMA_TARGET=component $(KARMA) start

test-browserify: node_modules build/browserify.js
	@KARMA_TARGET=browserify $(KARMA) start

#
# the browserified test suite
#

build/browserify.js: build
	@node_modules/browserify/bin/cmd.js test/browserify -d > $@

#
# Test coverage
#

test-cov: node_modules
	@$(ISTANBUL) cover $(COV_EXEC) -- --formatter hydro-silent

#
# Run the tests on SauceLabs
#

test-sauce: node_modules components build
	@TEST_ENV=sauce KARMA_RUN_ON=$(SAUCE_NODE_VERSION) $(KARMA) start

#
# Clean all
#

clean: clean-node clean-browser clean-components clean-cov

#
# Clean node_modules
#

clean-node:
	@rm -rf node_modules

#
# Clean the browser build
#

clean-browser:
	@rm -f $(BROWSER)
	@rm -f $(MIN)

#
# Clean components & build
#

clean-components:
	@rm -rf build
	@rm -rf components

#
# Clean the test coverage
#

clean-cov:
	@rm -rf coverage

#
# CI
#

ci: test-node test-sauce coveralls

#
# Send coverage to coveralls
#

coveralls: node_modules
	@$(ISTANBUL) cover $(COV_EXEC) --report lcovonly -- \
		--formatter hydro-silent \
		&& cat ./coverage/lcov.info | $(COVERALLS)

#
# Install all components (+ dev)
#

components: node_modules component.json
	@$(COMPONENT_INSTALL) --dev

#
# Install Node.js modules
#

node_modules: package.json
	@npm install
	@touch $@

#
# start a server for running the browser tests
# once started navigate the browser tab to the
# test directory
#

server:
	@node_modules/serve/bin/serve -LoJp 0

#
# commands to always run regardless of timestamps
#

.PHONY: all test coverage browser server
