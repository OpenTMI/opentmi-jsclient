const Promise = require('bluebird');

/**
 * Return object which contains duration between given date and current date
 * @param {Date}when first date to be compared against current date
 * @returns {Object} object which contains durations
 */
module.exports.timeSince = (when) => {
  const obj = {};
  obj._milliseconds = (new Date()).valueOf() - when.valueOf();
  obj.milliseconds = obj._milliseconds % 1000;
  obj._seconds = (obj._milliseconds - obj.milliseconds) / 1000;
  obj.seconds = obj._seconds % 60;
  obj._minutes = (obj._seconds - obj.seconds) / 60;
  obj.minutes = obj._minutes % 60;
  obj._hours = (obj._minutes - obj.minutes) / 60;
  obj.hours = obj._hours % 24;
  obj._days = (obj._hours - obj.hours) / 24;
  obj.days = obj._days % 365;
  // finally
  obj.years = (obj._days - obj.days) / 365;
  return obj;
};

/**
 * Rejects with message "not implemented" (default msg)
 * @param {String} msg - reject message
 * @returns {Promise<String>} - reject
 */
module.exports.notImplemented = (msg = 'not implemented') => Promise.reject(new Error(msg));

/**
 * return date which are beginnign of given day
 * @param {Date} date - input date
 * @returns {Date} - date beginning of given day
 */
module.exports.beginningOfDay = (date) => {
  const dateZero = new Date(date);
  dateZero.setHours(0);
  dateZero.setMinutes(0);
  dateZero.setSeconds(0);
  dateZero.setMilliseconds(0);
  return dateZero;
};
/**
 * return date which are end of given day
 * @param {Date} date - input date
 * @returns {Date} - date end of given day
 */
module.exports.endOfDay = (date) => {
  const dateEnd = new Date(date);
  dateEnd.setHours(23);
  dateEnd.setMinutes(59);
  dateEnd.setSeconds(59);
  dateEnd.setMilliseconds(999);
  return dateEnd;
};
