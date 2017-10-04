<h1 align="center">opentmi-jsclient</h1>
OpenTMI javascript client for node &amp; browser.

## Documentation
[here](docs)


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
const auth = new Authentication('http://localhost:3000');
auth
  .login('user@mail.com', 'password')
  .then(auth.connect.bind(auth))
```

### Browser
```
<script src="dist/opentmi-client.js"></script>
<script>
const {Authentication, Transport} = opentmiClient;
const auth = new Authentication('http://localhost:3000');
auth
  .login('user@mail.com', 'password')
  .then(auth.connect.bind(auth))
</script>
```

**Note:** see more examples from [sample](sample) -folder.
