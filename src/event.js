// 3rd party modules
const _ = require('lodash');
const Promise = require('bluebird');
const invariant = require('invariant');

// application modules
const {Document} = require('./utils');
const Resource = require('./resource');


class Event extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   * @param {Object}eventJson User data as plain json object
   */
  constructor(transport, eventJson) {
    super(transport, `/api/v0/events`, eventJson);
  }

  /**
   * Get resource info as short string
   * @return {string} user information as single line
   */
  toString() {
    return `${this.priority()}.${this.facility()}: ${this.msg()}`;
  }

  static get PRIORITIES() {
    return ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']
  }
  priority(value) {
    /**
     * Get event priority or set it
     * @param {String}value new name
     * @return {Item|string} returns item name or Item
     */
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
  id(value) {
    // e.g. PID of the process
    return this.getOrSet('id', value);
  }
  static get MSG_IDS() {
     return ['ALLOCATED', 'RELEASED', 'ENTER_MAINTENANCE', 'EXIT_MAINTENANCE', 'CREATED', 'DELETED', 'FLASHED'];
  }
  msgid(value) {
    if (value) invariant(Event.MSG_IDS.indexOf(value) >= 0, 'Not allowed msgid');
    return this.getOrSet('msgid', value);
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
