const invariant = require('invariant');
const Promise = require('bluebird');

const {Client, Admin, Cluster} = require('../src');

const client = new Client('http://localhost:3000');
client
  .login("email", 'password')
  .then(client.connect.bind(client))
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
    return client.emit('whoami')
      .then( data => {
        console.log(data);
      })
  })
  /*.then(() => {
    const a = new Admin(client);
    return a.version()
      .then(console.log);
  })*/
  .then(client.logout.bind(client))
  .catch(error => console.error(error.message));
