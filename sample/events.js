const {
  login, transport, logout
} = require('./common');

const {Events} = require('../src');

let events;
login()
  .then(() => {
    // find resources
    events = new Events(transport);
    return events.create()
      .debug()
      .facility('daemon')
      .msg('hello')
      .save();
  })
  .then(() => {
    return events.find()
      .exec()
      .then(docs => docs[0])
      .then((event) => {
        console.log(event.toString());
      });
  })
  .then(logout)
  .catch(error => console.error(error.message));
