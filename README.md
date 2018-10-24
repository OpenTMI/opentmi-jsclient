<h1 align="center">opentmi-jsclient</h1>

[![npm version](https://img.shields.io/npm/v/opentmi-jsclient.svg)](https://www.npmjs.com/package/opentmi-jsclient)
[![CircleCI](https://circleci.com/gh/OpenTMI/opentmi-jsclient/tree/master.svg?style=svg)](https://circleci.com/gh/OpenTMI/opentmi-jsclient/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/OpenTMI/opentmi-jsclient/badge.svg?branch=master)](https://coveralls.io/github/OpenTMI/opentmi-jsclient?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License badge](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io)
[![Greenkeeper badge](https://badges.greenkeeper.io/OpenTMI/opentmi-jsclient.svg)](https://greenkeeper.io/)

Promise based [OpenTMI](https://github.com/opentmi/opentmi) javascript client for node.js and browser.
Extendable for custom API's provided by opentmi addons.


## Requirements
* [opentmi backend](https://github.com/opentmi/opentmi)

## Documentation
[API documentation](https://opentmi.github.io/opentmi-jsclient/)

## Installation

```
npm i opentmi-jsclient
```

## Build

to build minified version to dist -folder run:
```
> npm run build
```

build api documentations
```
> npm run doc
```

**Note:** all available commands are visible when you run: `npm run`

## Sample

### Node.js
```javascript
const {Authentication, Transport, Resources} = require('opentmi-client');
const transport = new Transport('http://localhost:3000')
const auth = new Authentication(transport);
auth
  .login('user@mail.com', 'password')
  .then(() => transport.connect())
  .then(() => {
      const collection = new Resources(transport);
      return collection.find()
        .haveTag('fantastic')
        .exec()
        .then(resources => resources[0])
        .then(resource => {
          return resource
            .name('new name')
            .save();
        });
  })
```

### Browser
```javascript
<script src="dist/opentmi-client.js"></script>
<script>
const {Authentication, Transport} = opentmiClient;
const transport = new Transport('http://localhost:3000')
const auth = new Authentication(transport);
auth
  .login('user@mail.com', 'password')
  .then(() => transport.connect())
</script>
```

**Note:** see more examples from [sample](sample) -folder.


### Customize

It is easy to create support for custom API's. See example below:

```javascript
class CustomAPI {
  constructor(transport) {
    this._transport = transport;
  }
  some() {
    debug('attempt to get something from custom addon api');
    return this._transport
      .get('/addon-api')
      .then(response => response.data);
  }
}
const customApi = new CustomAPI(transport);
customApi.some().then(data => console.log(data));
```

### License
[MIT](LICENSE)
