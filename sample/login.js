const {Authentication, Transport} = require('../src');

const transport = new Transport('http://localhost:3000');
const auth = new Authentication(transport);
const token = process.env.GITHUB_ACCESS_TOKEN;
const email = process.argv[1];
const password = process.argv[2];
let login;
if (token) {
  login = auth.loginWithToken(token);
} else {
  login = auth.login(email, password);
}
login
  .then(() => {
    console.log(`login success, token: ${transport.token}`);
  })
  .catch((error) => {
    console.error(`login fails: ${error}`);
  });
