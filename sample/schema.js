const {
  login, transport, print, logout
} = require('./common');

const {Schemas} = require('../src');

const schema = new Schemas(transport);

login()
  // .then(print('updateSchemas').then(schema.updateSchemas.bind(schema)))
  .then(print('get collections')().then(schema.collections.bind(schema)))
  .then(print('get Result schema')().then(() => schema.schema('Result')))
  .then(print('get Result schema')().then(() => schema.schema('Result')))
  .then(logout)
  .catch(error => console.error(error.message));
