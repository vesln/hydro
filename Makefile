# Run the tests on SauceLabs only when
# the current node version is the following:

NODE_VERSION = v0.10.

# Path to uglify.js

UGLIFY = node_modules/uglify-js/bin/uglifyjs

all: install

#
# Install
#

install: node_modules components build browser

#
# Browser build
#

browser: node_modules lib/* components
	@./node_modules/.bin/component-build -s Hydro -o .
	@mv build.js hydro.js
	@$(UGLIFY) hydro.js --output hydro.min.js

#
# Make a new development build
#

build: components lib/*
	@./node_modules/.bin/component-build --dev

#
# Run all tests
#

test: test-node test-browser

# Run the Node.js tests

test-node:
	@bin/hydro

#
# Run the browser tests
#

test-browser: components build
	@./node_modules/.bin/karma start

#
# Run the tests on SauceLabs
#

test-sauce: components build
	@TEST_ENV=sauce KARMA_RUN_ON=$(NODE_VERSION) ./node_modules/.bin/karma start

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
	@rm -f hydro.js
	@rm -f hydro.min.js

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

coveralls:
	@./node_modules/.bin/istanbul cover bin/_hydro --report lcovonly -- \
		--formatter hydro-silent \
		&& cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

#
# Install all components (+ dev)
#

components: node_modules component.json
	@./node_modules/.bin/component-install --dev

#
# Install Node.js modules
#

node_modules: package.json
	@npm install

#
# Instructions
#

.PHONY: all test coverage browser
