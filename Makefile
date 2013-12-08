all: browser

browser: node_modules lib/* components
	@./node_modules/.bin/component-build -s hydro -o .
	@mv build.js hydro.js

components: node_modules component.json
	@./node_modules/.bin/component-install --dev

.PHONY: all
