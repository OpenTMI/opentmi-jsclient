// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');

// application modules
const Base = require('./base');


class Collection extends Base {
  _find(query) {
    invariant(_.isString(query), 'query hould be a string');
    invariant(this._transport.isLoggedIn, 'Transport should be logged in');
    return this._transport.get(`${this.colPath()}?${query}`)
      .then(resp => resp.data);
  }

  _update(data, query = undefined) {
    return this._transport.put({
      path: this._path,
      query: query ? query.toString() : undefined,
      data
    });
  }

  _get(id) {
    invariant(_.isString(id), 'id hould be a string');
    invariant(this._transport.isLoggedIn, 'Transport should be logged in');
    return this._transport.get(this.docPath(id))
      .then(resp => resp.data);
  }

  _delete() {
    return this._notImplemented();
  }

  _patch() {
    return this._notImplemented();
  }
}

module.exports = Collection;
