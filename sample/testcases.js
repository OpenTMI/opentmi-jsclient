const _ = require('lodash');

const {
  login, transport, print, logout
} = require('./common');

const {Testcases} = require('../src');
const testcases = new Testcases(transport);

login()
  .then(() => {
    return testcases.find()
      .limit(5)
      .exec()
      .then((tcs) => {
        _.each(tcs, tc => console.log(tc.toString()));
      });
  })
  .then(() => {
    return testcases.create()
      .tcid('12345')
      .save()
      .then(doc => console.log(doc.toString()))
      .catch(error => console.log(error.message));
  })
  .then(logout)
  .catch(error => console.error(error.message));
