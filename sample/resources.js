const {
  login, transport, logout
} = require('./common');

const {Resources} = require('../src');

login()
  .then(() => {
    // find resources
    const resources = new Resources(transport);
    return resources.find()
    // .id('test')
      .exec()
      .then(resources => resources[0])
      .then((resource) => {
        console.log(resource.toString());
        return resource
          .name(`${resource.name()}abc`)
          .location.site('oulu')
          .location.country('finland')
          .save()
          .then(data => console.log(data.toString()));
      });
  })
  .then(logout)
  .catch(error => console.error(error.message));
