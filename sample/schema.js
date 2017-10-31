const {
  login, transport, print, logout
} = require('./common');

const {Schemas} = require('../src');

const schema = new Schemas(transport);
//schema.updateSchemas = schema.updateSchemas.bind(schema);
schema.collections = schema.collections.bind(schema);

login()
  // .then(print('updateSchemas').then(schema.updateSchemas)
  .then(print('get collections')).then(schema.collections).then(cols => console.log(cols))
  .then(print('get Result schema')).then(() => schema.schema('Result').then(sch => console.log(sch)))
  .then(logout)
  .catch(error => console.error(error.message));
