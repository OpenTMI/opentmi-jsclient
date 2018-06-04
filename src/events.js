// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');


// application modules
const Event = require('./event');
const {QueryBase, Document, Collection, notImplemented} = require('./utils');

/**
 * @class EventsQuery
 * @extends QueryBase
 */
class EventsQuery extends QueryBase {
  /* Find events by _id
   * @param {string} type
   * @return {Query}
   */
  _id(_id) {
    invariant(_.isString(_id), 'id should be a string');
    return this.has({_id});
  }
  priority(value) {
    invariant(Event.PRIORITIES.indexOf(value) >= 0, 'Not allowed priority');
    return this.has({'priority.level': value});
  }
  facility(value) {
    invariant(Event.FACILITIES.indexOf(value) >= 0, 'Not allowed facility');
    return this.has({'priority.facility': value});
  }
}

/**
 * @extends Collection
 */
class Events extends Collection {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/events');
    this._notImplemented = notImplemented;
  }

  /**
   * Find Users
   * @return {UsersQuery} Returns query object to find Users
   */
  find() {
    return new EventsQuery(this, Event);
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented('Events update is not implemented');
  }

  /**
   * Create new event
   * @return {Event} event object
   */
  create() {
    const NewEvent = Document.IsNewDocument(Event);
    return new NewEvent(this._transport);
  }
}

module.exports = Events;
