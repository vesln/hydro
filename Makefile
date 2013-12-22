# Run the tests on SauceLabs only when
# the current node version is the following:

NODE_VERSION = v0.10.

all: install

# Install

install: node_modules components build browser

# Browser build

browser: node_modules lib/* components
	@./node_modules/.bin/component-build -s Hydro -o .
	@mv build.js hydro.js

# Make a new development build

build: components lib/*
	@./node_modules/.bin/component-build --dev

# Run all tests

test: test-node test-browser

# Run the Node.js tests

test-node:
	@bin/hydro

# Run the browser tests

test-browser: components build
	@./node_modules/.bin/karma start

# Run the tests on SauceLabs

test-sauce:
	@TEST_ENV=sauce RUN_ON=$(NODE_VERSION) ./node_modules/.bin/karma start

# Clean

clean: clean-node clean-browser clean-components clean-cov

clean-node:
	@rm -rf node_modules

clean-browser:
	@rm -f hydro.js

clean-components:
	@rm -rf build
	@rm -rf components

clean-cov:
	@rm -rf coverage

# CI

ci: test-node test-sauce coveralls

coveralls:
	@./node_modules/.bin/istanbul cover bin/_hydro --report lcovonly -- \
		--formatter hydro-silent \
		&& cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

# Support

components: node_modules component.json
	@./node_modules/.bin/component-install --dev

node_modules: package.json
	@npm install

.PHONY: all test coverage browser
