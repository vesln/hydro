#
# Variables
#

cov_exec    := bin/_hydro
istanbul    := node_modules/.bin/istanbul
global_name := Hydro
test_exec   := bin/hydro
npm         := npm
source      := $(shell find lib -name '*.js')

#
# All
#

all: clean install test

#
# Install
#

install: node_modules

#
# Run all tests
#

test: test-node

#
# Clean all
#

clean: clean-node clean-cov

#
# Run the Node.js tests
#

test-node: node_modules
	@$(test_exec)

#
# Test coverage
#

test-cov: node_modules
	@$(istanbul) cover $(cov_exec) -- --formatter hydro-silent

#
# CI
#

test-ci: test-node

#
# Clean node_modules
#

clean-node:
	@rm -rf node_modules

#
# Clean the test coverage
#

clean-cov:
	@rm -rf coverage

#
# Install Node.js modules
#

node_modules: package.json
	@$(npm) install
	@touch $@

#
# Commands to always run regardless of timestamps
#

.PHONY: test-node test-cov test-ci test-sauce
.PHONY: clean-node clean-cov
