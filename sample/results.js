const _ = require('lodash');

const {login, transport, logout} = require('./common');
const {Results} = require('../src');

const results = new Results(transport);

login()
  .then(() =>
    results.find()
      .isHW()
      .limit(5)
      .skip(4)
      .isPass()
      .exec()
      .then((docs) => {
        _.each(docs, r => console.log(r.toString()));
        // console.log(results[0].toJson());
      })
  )
  .then(() =>
    // start listening new result
    results.connect()
      .then(() => {
        results.on('new', (result) => {
          console.log(result.toString());
        });
      })
  )
  .then(() =>
    // upload new result
    results
      .create()
      .tcid('123').verdict('pass')
      .save()
      .then(doc => console.log(doc.toString()))
      .catch(error => console.error(error.message))
  )
  .then(logout)
  .catch(error => console.error(error.message));
