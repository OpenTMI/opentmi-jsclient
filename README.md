<h1 align="center">opentmi-jsclient</h1>

[![CircleCI](https://circleci.com/gh/OpenTMI/opentmi-jsclient/tree/master.svg?style=svg)](https://circleci.com/gh/OpenTMI/opentmi-jsclient/tree/master)

Promise based OpenTMI javascript client for node.js and browser.

## Requirements

[![Greenkeeper badge](https://badges.greenkeeper.io/OpenTMI/opentmi-jsclient.svg)](https://greenkeeper.io/)
* [socket.io-client](https://github.com/socketio/socket.io-client) (for socketio connections)
* [axios](https://github.com/axios/axios) (Promise based http client)

## Documentation
[API documentation](https://opentmi.github.io/opentmi-jsclient/opentmi-jsclient/0.1.0/)


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
const {Authentication, Transport} = require('opentmi-client');
const transport = new Transport('http://localhost:3000')
const auth = new Authentication(transport);
auth
  .login('user@mail.com', 'password')
  .then(transport.connect.bind(transport))
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

### License
[MIT](LICENSE)
