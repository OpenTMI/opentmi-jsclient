const {Authentication, Transport} = require('../src');

const transport = new Transport('http://localhost:3000');
const auth = new Authentication(transport);
auth.loginWithToken(process.env.GITHUB_ACCESS_TOKEN)
  .then(() => {
    console.log('login success');
  })
  .catch((error) => {
    console.error(`login fails: ${error}`);
  })
