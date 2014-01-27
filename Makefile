# Run the tests on SauceLabs only when
# the current node version is the following:

SAUCE_NODE_VERSION = v0.10.

#
# Variables
#

min               := dist/hydro.min.js
uglify            := node_modules/uglify-js/bin/uglifyjs
browser           := dist/hydro.js
cov_exec          := bin/_hydro
istanbul          := node_modules/.bin/istanbul
browserify        := node_modules/browserify/bin/cmd.js
karma_exec        := node_modules/karma/bin/karma start
component_build   := node_modules/.bin/component-build
component_install := node_modules/.bin/component-install
global_name       := Hydro
test_exec         := bin/hydro
npm               := npm
source            := $(shell find lib -name '*.js')

#
# All
#

all: clean install test

#
# Install
#

install: node_modules components build/build.js browser

#
# Run all tests
#

test: test-node test-browser

#
# Clean all
#

clean: clean-node clean-browser clean-components clean-cov

#
# Browser build
#

browser: node_modules components
	@$(component_build) -s $(global_name) -o .
	@mv build.js $(browser)
	@$(uglify) $(browser) --output $(min)

#
# Run the Node.js tests
#

test-node: node_modules
	@$(test_exec)

#
# Run the browser tests
#

test-browser: test-component test-browserify

#
# Run the browser tests for the component build
#

test-component: node_modules components build/build.js
	@KARMA_TARGET=component $(karma_exec)

#
# Run the browser tests for the browserify build
#

test-browserify: node_modules build/browserify.js
	@KARMA_TARGET=browserify $(karma_exec)

#
# The browserified test suite
#

build/browserify.js: node_modules $(source) test/browserify
	@$(browserify) test/browserify -d > $@

#
# Make a new development build
#

build/build.js: node_modules components $(source)
	@$(component_build) --dev

#
# Test coverage
#

test-cov: node_modules
	@$(istanbul) cover $(cov_exec) -- --formatter hydro-silent

#
# CI
#

test-ci: test-node test-sauce

#
# Run the tests on SauceLabs
#

test-sauce: node_modules components build/build.js
	@TEST_ENV=sauce KARMA_RUN_ON=$(SAUCE_NODE_VERSION) $(karma_exec)

#
# Clean node_modules
#

clean-node:
	@rm -rf node_modules

#
# Clean the browser build
#

clean-browser:
	@rm -f $(browser)
	@rm -f $(min)

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
# Install all components (+ dev)
#

components: node_modules component.json
	@$(component_install) --dev

#
# Install Node.js modules
#

node_modules: package.json
	@$(npm) install
	@touch $@

#
# Start a server for running the browser tests
# once started navigate the browser tab to the
# test directory
#

server:
	@node_modules/serve/bin/serve -LoJp 0

#
# Commands to always run regardless of timestamps
#

.PHONY: test-node test-component test-browserify test-cov test-ci test-sauce
.PHONY: clean-node clean-browser clean-components clean-cov server
