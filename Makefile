BROWSERIFY ?= browserify
MINIFY ?= minify
REPORTER ?= spec
MOCHA ?= mocha
MOCHA_PHANTOMJS ?= mocha-phantomjs
#FILTER ?= .+
BROWSERIFIED ?= dist/opentmi-client.js
MINIFIED ?= dist/opentmi-client.min.js
BROWSER_TEST ?= test/browser-test.js
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
	${MOCHA_PHANTOMJS} -p node_modules/phantomjs/bin/phantomjs -R ${REPORTER} -g '${FILTER}' test/index.html

test-node:
	NODE_ENV=test ${MOCHA} --reporter $(REPORTER) --recursive -g '${FILTER}'

coverage:
	NODE_ENV=test istanbul cover -- _mocha --recursive -R ${REPORTER} -g '${FILTER}'

doc:
	./node_modules/.bin/jsdoc -d doc --readme README.md -r src package.json

lint:
	eslint src