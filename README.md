<h1 align="center">opentmi-jsclient</h1>

[![CircleCI](https://circleci.com/gh/OpenTMI/opentmi-jsclient/tree/master.svg?style=svg)](https://circleci.com/gh/OpenTMI/opentmi-jsclient/tree/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License badge](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io)
[![Greenkeeper badge](https://badges.greenkeeper.io/OpenTMI/opentmi-jsclient.svg)](https://greenkeeper.io/)

Promise based [OpenTMI](https://github.com/opentmi/opentmi) javascript client for node.js and browser.
Extendable for custom API's provided by opentmi addons.

## Requirements
* [socket.io-client](https://github.com/socketio/socket.io-client) (for socketio connections)
* [axios](https://github.com/axios/axios) (Promise based http client)

## Documentation
[API documentation](https://opentmi.github.io/opentmi-jsclient/opentmi-jsclient/0.2.0/)


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
  .then(transport.connect.bind(transport))
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
```
<script src="dist/opentmi-client.js"></script>
<script>
const {Authentication, Transport} = opentmiClient;
const transport = new Transport('http://localhost:3000')
const auth = new Authentication(transport);
auth
  .login('user@mail.com', 'password')
  .then(transport.connect.bind(transport))
</script>
```

**Note:** see more examples from [sample](sample) -folder.


### Customize

It is easy to create API support for custom API's. See example below:

```
class CustomAPI {
  constructor(transport) {
    this._transport = transport;
  }
  some() {
    debug('attempt to restart all workers');
    return this._transport
      .get('/api/v0/addons-api')
      .then((response) => response.data;
      });
  }
}
const customApi = new CustomAPI(transport);
customApi.some().then(data => console.log(data));
```

### License
[MIT](LICENSE)
