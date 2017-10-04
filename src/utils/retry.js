// 3rd party modules
const _ = require('lodash');
const Promise = require('bluebird');
// application modules
const objectMerge = require('./object-merge');

// application modules
const debug = require('./debug');

const retryUpdate = function (original, changes, update, retryCount = 2, retryInterval = 2) {
  return update(changes).catch((error) => {
    if (retryCount > 0 && error.response.status === 409) {
      const result = objectMerge(original, changes, error.response.data);
      if (_.has(result, 'conflicts')) {
        debug('cannot merge automatically without conflicts');
        _.set(error, 'conflicts', _.get(result, 'conflicts'));
        _.set(error, 'reason', 'merge conflicts');
        throw error;
      }
      debug(result);
      const merged = _.get(result, 'merged');
      return Promise.delay(retryInterval * 1000)
        .then(() => (retryUpdate(original, merged, update, retryCount - 1, retryInterval)));
    }
    _.set(error, 'reason', 'no retries left');
    throw error;
  });
};

module.exports = retryUpdate;
