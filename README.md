<h1 align="center">opentmi-jsclient</h1>
OpenTMI javascript client for node &amp; browser.

## Documentation
[here](docs)

## Sample

```javascript
const {Authentication, Transport} = require('opentmi-client');
const auth = new Authentication('http://localhost:3000');
auth
  .login('user@mail.com', 'password')
  .then(auth.connect.bind(auth))
```

**Note:** see more examples from [sample](sample) -folder.
