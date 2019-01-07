const Promise = require('bluebird');
const debug = console.log.bind(console) //require('./debug');


class Lock {
  constructor() {
    this._lock = Promise.resolve();
  }
  isResolved() {
    return this._lock.isResolved();
  }
  obtainLock() {
    if (this._lock.isPending()) {
      debug('wait pending lock');
      return Promise
        .join(this._lock)
        .then(() => this.obtainLock());
    }
    let resolvePending;
    this._lock = new Promise((resolve) => {
      resolvePending = resolve;
    });
    return Promise.try(() => {
      debug('locked');
    }).disposer(() => {
      debug('lock released');
      resolvePending();
    });
  }
}

module.exports = Lock;
