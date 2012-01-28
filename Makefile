
TESTS = test/*.js
REPORTER = spec

all:
	@node support/compile

clean:
	@rm dist/filtr.js dist/filtr.min.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

.PHONY: all clean test
