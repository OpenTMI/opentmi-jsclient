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
          .type('dut')
          .name(`${resource.name()}abc`)
          .location.site('oulu')
          .location.country('finland')
          .hw.sn('12')
          .hw.firmware.version('12')
          .hw.firmware.name('test')
          .save()
          .then(data => console.log(data));
      });
  })
  .then(logout)
  .catch(error => console.error(error.message));
