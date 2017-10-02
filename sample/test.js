const invariant = require('invariant');
const Promise = require('bluebird');

const {Authentication, Admin, Cluster, Transport} = require('../src');

const transport = new Transport('http://localhost:3000');
const auth = new Authentication(transport);
auth
  .login("email", 'password')
  .then(auth.connect.bind(auth))
  /*.then(() => {
    invariant(client.isConnected, "should be connected");
    console.log('create cluster object');
    const c = new Cluster(client);
    return c
      .refresh()
      .then(() => {
        console.log(c.workers, c.status);
      })
      .then(c.restartWorkers.bind(c))
      .catch(error => console.log(error.message));
  })*/
  .then(()=> {
    const DELAY = 10;
    console.log(`delay ${DELAY}s`);
    return Promise.delay(DELAY*1000)
      .then(()=>console.log('continue..'));
  })
  .then(() => {
    return auth.whoami()
      .then( data => {
        console.log(data);
      })
  })
  /*.then(() => {
    const a = new Admin(transport);
    return a.version()
      .then(console.log);
  })*/
  .then(transport.logout.bind(transport))
  .catch(error => console.error(error.message));
