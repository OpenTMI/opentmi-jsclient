const _ = require('lodash');

const {
  login, transport, print, logout
} = require('./common');

const {Testcases} = require('../src');

login()
  .then(() => {
    const testcases = new Testcases(transport);
    return testcases.find()
      .limit(5)
      .exec()
      .then((tcs) => {
        _.each(tcs, tc => console.log(tc.toString()));
      });
  })
  .then(logout)
  .catch(error => console.error(error.message));
