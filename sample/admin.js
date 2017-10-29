const {
  login, transport, logout
} = require('./common');

const {
  Admin, Cluster
} = require('../src');

login()
  .then(() => {
    console.log('create cluster object');
    const c = new Cluster(transport);
    return c
      .refresh()
      .then(() => {
        console.log(c.workers, c.status);
      })
      .then(c.restartWorkers.bind(c))
      .catch(error => console.log(error.message));
  })
  .then(() => {
    const a = new Admin(transport);
    return a.version()
      .then(console.log);
  })
  .then(logout)
  .catch(error => console.error(error.message));
