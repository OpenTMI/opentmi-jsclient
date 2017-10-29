const {
  login, transport, logout, auth
} = require('./common');

const {Users, Loans} = require('../src');

login()
  // .then(() => auth.whoami().then(data => console.log(data)))
  .then(() => Users
    // check who am i
    .WHOAMI(transport)
    .then((me) => {
      console.log('me:', me.toJson());
      // check which group I belong
      return me
        .groups()
        .then(groups => console.log(groups.toString()));
    }))
  .then(() => Users
    // check what I've loan
    .WHOAMI(transport)
    .then(user => user.myLoans())
    .then(loans => console.log('loans:', loans)))
  .then(() => Loans
    // check loans by user id
    .forUser({id: '5825bb7cfe7545132c88c773'}, transport)
    .then((loans) => {
      console.log('loans:', loans);
      // console.log(loans[0].loanItems())
    }))
  .then(logout)
  .catch(error => console.error(error.message));
