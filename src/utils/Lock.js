const Promise = require('bluebird');

const debug = require('./debug');


class Lock {
  /**
   * Lock Constructor
   */
  constructor() {
    this._lock = Promise.resolve();
  }

  /**
   * Check if no pending actions
   * @return {Boolean} True if lock is free
   */
  isResolved() {
    return this._lock.isResolved();
  }

  /**
   * Obtain lock. Pending actions will be wait.
   * @example
   * Promise.using(lock.obtainLock(), () => Promise.resolve());
   * @return {Promise.disposer} Disposer to be used with Promise.using()
   */
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

  /**
   * Run promise with lock. Parallel promises will be postponed until previous is fulfilled.
   * @param {Function<Promise>}then
   * @return {Promise} resolves/rejects argument given "then"
   */
  withLock(then) {
    const lock = this.obtainLock();
    return Promise.using(lock, then);
  }
}

module.exports = Lock;
