// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const {Document} = require('./utils');


class Event extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   * @param {Object}eventJson User data as plain json object
   */
  constructor(transport, eventJson) {
    super(transport, '/api/v0/events', eventJson);
  }

  /**
   * Get resource info as short string
   * @return {string} user information as single line
   */
  toString() {
    return `${this.priority()}.${this.facility()}: ${this.msg()}`;
  }
  /**
   * get PRIORITIES as array
   * @return {Array<string>} list of priorities
   */
  static get PRIORITIES() {
    return ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'];
  }
  /**
   * Get event priority or set it
   * @param {String}value new name
   * @return {Item|string} returns item name or Item
   */
  priority(value) {
    if (value) invariant(Event.PRIORITIES.indexOf(value) >= 0, 'Not allowed priority');
    return this.getOrSet('priority.level', value);
  }

  resource(obj) {
    invariant(_.isString(obj.id), 'resource object should have id');
    return this.getOrSet('ref.resource', obj.id);
  }
  result(obj) {
    invariant(_.isString(obj.id), 'result object should have id');
    return this.getOrSet('ref.result', obj.id);
  }
  testcase(obj) {
    invariant(_.isString(obj.id), 'testcase object should have id');
    return this.getOrSet('ref.testcase', obj.id);
  }
  emergency() {
    return this.priority('emerg');
  }
  alert() {
    return this.priority('alert');
  }
  critical() {
    return this.priority('crit');
  }
  error() {
    return this.priority('err');
  }
  warning() {
    return this.priority('warning');
  }
  notice() {
    return this.priority('notice');
  }
  info() {
    return this.priority('info');
  }
  debug() {
    return this.priority('debug');
  }

  static get FACILITIES() {
    return ['auth', 'cron', 'daemon', 'mail', 'news', 'syslog', 'user', 'resource', 'testcase'];
  }
  facility(value) {
    if (value) invariant(Event.FACILITIES.indexOf(value) >= 0, 'Not allowed facility');
    return this.getOrSet('priority.facility', value);
  }
  duration(value) {
    if (value) invariant(_.isNumber(value), 'value should be an number');
    return this.getOrSet('duration', value);
  }
  spare(value) {
    return this.getOrSet('spare', value);
  }
  id(value) {
    // e.g. PID of the process
    return this.getOrSet('id', value);
  }

  /**
   * get list of allowed `msgid` values
   * @return {string[]} list of allowed msgid values
   * @constructor
   */
  static get MSG_IDS() {
    return ['ALLOCATED', 'RELEASED', 'ENTER_MAINTENANCE', 'EXIT_MAINTENANCE', 'CREATED', 'DELETED', 'FLASHED'];
  }

  /**
   * Get event msgid or set it. See allowed values from MSG_IDS
   * @param {String|undefined}value new msgid
   * @return {Event|undefined} Event object or value
   */
  msgid(value) {
    if (value) invariant(Event.MSG_IDS.indexOf(value) >= 0, 'Not allowed msgid');
    return this.getOrSet('msgid', value);
  }

  /**
   * Traceid for event. when traceid is given traceid+msgid is unique in DB.
   * @param {String}value new value for traceid
   * @return {Resource|undefined}
   */
  traceid(value) {
    return this.getOrSet('traceid', value);
  }
  allocated() {
    return this.msgid('ALLOCATED');
  }
  released() {
    return this.msgid('RELEASED');
  }
  enterMaintenance() {
    return this.msgid('ENTER_MAINTENANCE');
  }
  exitMaintenance() {
    return this.msgid('EXIT_MAINTENANCE');
  }
  created() {
    return this.msgid('CREATED');
  }
  deleted() {
    return this.msgid('DELETED');
  }
  flashed() {
    return this.msgid('FLASHED');
  }
  tag(value) {
    return this.getOrSet('tag', value);
  }
  msg(value) {
    return this.getOrSet('msg', value);
  }
}

module.exports = Event;
