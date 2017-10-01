<h1 align="center">opentmi-jsclient</h1>
OpenTMI javascript client for node &amp; browser.

## Documentation
[here](doc)

## Sample

```javascript
const client = new Client('http://localhost:3000');
client
  .login('user@mail.com', 'password')
  .then(client.connect.bind(client))
```

see more from [sample](sample) older.
