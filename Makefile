all: browser

test:
	@bin/hydro test/*.test.js test/*/*.test.js

coverage:
	@./node_modules/.bin/istanbul cover bin/_hydro -- \
		--formatter hydro-silent \
		test/*.test.js \
		test/*/*.test.js

coveralls:
	@./node_modules/.bin/istanbul cover bin/_hydro --report lcovonly -- \
		--formatter hydro-silent \
		test/*.test.js \
		test/*/*.test.js \
		&& cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

browser: node_modules lib/* components
	@./node_modules/.bin/component-build -s hydro -o .
	@mv build.js hydro.js

components: node_modules component.json
	@./node_modules/.bin/component-install --dev

.PHONY: all test coverage
