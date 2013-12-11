all: test

# Make standalone browser build

browser: node_modules lib/* components
	@./node_modules/.bin/component-build -s hydro -o .
	@mv build.js hydro.js

# Make a new build

build: components lib/*
	@./node_modules/.bin/component-build --dev

# Clean

clean:
	@rm -rf hydro.js
	@rm -rf ./components
	@rm -rf ./build
	@rm -rf ./coverage

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

.PHONY: all test coverage browser
