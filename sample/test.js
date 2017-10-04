const invariant = require('invariant');
const Promise = require('bluebird');

const {
  Authentication, Admin, Cluster, Transport, Schemas
} = require('../src');

const RESTART_WORKERS = false;
const GET_VERSION = false;

const transport = new Transport('http://localhost:3000');
const auth = new Authentication(transport);
const schema = new Schemas(transport);

const print = (message) => () => {
  console.log(message);
  return Promise.resolve();
};
        print('login')().then(() => auth.login('username', 'password'))
  //.then(print('connect IO')).then(transport.connect.bind(transport))
  //.then(print('updateSchemas')).then(schema.updateSchemas.bind(schema))
  //.then(print('get collections')).then(schema.collections.bind(schema))
  //.then(print('get Result schema')).then(() => schema.schema('Result'))
  //.then(print('get Result schema')).then(() => schema.schema('Result'))
  .then(() => {
    invariant(transport.isLoggedIn, "should be logged in");
    if (RESTART_WORKERS) {
      console.log('create cluster object');
      const c = new Cluster(transport);
      return c
        .refresh()
        .then(() => {
          console.log(c.workers, c.status);
        })
        .then(c.restartWorkers.bind(c))
        .catch(error => console.log(error.message));
    }
    return Promise.resolve();
  })
  .then(() => {
    const DELAY = 10;
    return print(`delay ${DELAY}s`)().then( () => Promise.delay(DELAY * 1000))
      .then(print('continue..'));
  })
  .then(() => auth.whoami().then(data => console.log(data)))
  .then(() => {
    if(!GET_VERSION) {
      return Promise.resolve();
    }
    const a = new Admin(transport);
    return a.version()
      .then(console.log);
  })
  .then(auth.logout.bind(auth))
  .catch(error => console.error(error.message));
