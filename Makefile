BROWSERIFY ?= browserify
MINIFY ?= minify
REPORTER ?= spec
MOCHA ?= mocha
MOCHA_HEADLESS_CHROME ?= node_modules/mocha-headless-chrome/bin/start
#FILTER ?= .+
BROWSERIFIED ?= dist/opentmi-client.js
MINIFIED ?= dist/opentmi-client.min.js
BROWSER_TEST ?= browser-test.js
TESTS = $(addprefix test/,api.js)

.PHONY: browserify minify test test-node test-browser bower-install coverage clean doc lint

clean:
	rm -f ${BROWSERIFIED} ${MINIFIED} ${BROWSER_TEST}

bower-install:
	bower install

ALL_DEPS := $(sort $(shell ${BROWSERIFY} --list src/index.js))
${BROWSERIFIED}: ${ALL_DEPS} package.json Makefile
	${BROWSERIFY} -o $@ -s opentmiClient -r ./src/index.js:opentmiClient ${ALL_DEPS}

browserify: ${BROWSERIFIED}

${MINIFIED} : ${BROWSERIFIED}
	${MINIFY} $< -o $@

minify: ${MINIFIED}

test: test-node test-browser

${BROWSER_TEST} : $(shell ${BROWSERIFY} --list ${TESTS})
	${BROWSERIFY} -o $@ ${TESTS}


test-browser: bower-install ${BROWSER_TEST}
	${MOCHA_HEADLESS_CHROME} -f test/index.html

test-node:
	NODE_ENV=test ${MOCHA} --reporter $(REPORTER) --recursive -g '${FILTER}'

coverage:
	NODE_ENV=test istanbul cover -- _mocha --recursive -R ${REPORTER} -g '${FILTER}'

doc:
	./node_modules/.bin/jsdoc -d docs --readme README.md -r src package.json --verbose

lint:
	eslint src test

lint-fix:
	eslint src test --fix
