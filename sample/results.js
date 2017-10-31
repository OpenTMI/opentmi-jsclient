const _ = require('lodash');

const {
  login, transport, print, logout
} = require('./common');

const {Results} = require('../src');
const results = new Results(transport);

login()
  .then(() => {
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
  .then(() => {
    // upload new result
    return results
      .create()
      .tcid('123').verdict('pass')
      .save()
      .then(doc => console.log(doc.toString()))
      .catch(error => console.error(error.message))
  })
  .then(logout)
  .catch(error => console.error(error.message));
