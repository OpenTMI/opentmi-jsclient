const _ = require('lodash');
const {
  login, transport, logout
} = require('./common');

const {Users, Loans} = require('../src');

login()
  .then(() => {
    const loans = new Loans(transport);
    loans.find()
      .loadItems().loadResources().loadLoaner()
      .exec()
      .then((items) => {
        _.each(items, item => console.log(item.toString()));
        if (items.length>0) {
          console.log(JSON.stringify(items[0].toJson(), null, 2));
        }
      });
  })
  .then(() => Users.WHOAMI(transport)
    .then(user => user.myLoans())
    .then((loans) => {
      console.log('loans:', loans);
    }))
  .then(logout)
  .catch(error => console.error(error.message));
