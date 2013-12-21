all: test

# Install

install: node_modules components browser

# Browser build

browser: node_modules lib/* components
	@./node_modules/.bin/component-build -s Hydro -o .
	@mv build.js hydro.js

# Make a new browser build

build: components lib/*
	@./node_modules/.bin/component-build --dev

release: test build browsers
	@git changelog

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

test:
	@bin/hydro

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
