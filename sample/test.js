const {login, logout} = require('./common');

login()
  .then(logout)
  .catch(error => console.error(error.message));
