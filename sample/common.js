const {Transport, Authentication} = require('../src');

const transport = new Transport('http://localhost:3000');
const auth = new Authentication(transport);

const print = message => () => {
  console.log(message);
  return Promise.resolve();
};

const login = () => print('login')()
  .then(() => auth.login('jussiva@gmail.com', 'heidiva'))
  .then(print('connect IO'))
  .then(transport.connect.bind(transport));

const logout = () => print('logout')()
  .then(() => auth.logout());

// just for debugging purpose..
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').');
});

// exports
module.exports = {
  transport,
  auth,
  login,
  logout,
  print
};
