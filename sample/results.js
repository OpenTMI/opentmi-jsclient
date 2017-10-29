const _ = require('lodash');

const {
  login, transport, print, logout
} = require('./common');

const {Results} = require('../src');

login()
  .then(() => {
    const results = new Results(transport);
    return results.find()
      .isHW()
      .limit(5)
      .skip(4)
      .isPass()
      .exec()
      .then((results) => {
        _.each(results, r => console.log(r.toString()));
        // console.log(results[0].toJson());
      });
  })
  .then(logout)
  .catch(error => console.error(error.message));
