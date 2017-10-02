const invariant = require('invariant');
const _ = require('lodash');
// application modules
const {debug} = require('./utils');

class Authentication {
  /**
   * Constructor for Client connection.
   * Object manage all low level communication and authentication
   * @param transport - transport layer for communication
   */
  constructor(transport) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
  }

  /**
   * Login to OpenTMI
   * @param {string} email
   * @param {string} password
   * @param {string} token - optional token
   * @return {Promise.<string>} - return a token
   */
  login(email, password, token = undefined) {
    invariant(!_.isString(this._transport.token), 'is logged out alread!');
    if (_.isString(token)) {
      this._transport.token = token;
    }
    invariant(_.isString(email), 'email should be string');
    invariant(_.isString(password), 'password should be string');
    return this._transport
      .post('/auth/login', {email, password}, {})
      .then((response) => {
        invariant(response.data.token, 'there should be token');
        debug(`Login response: ${JSON.stringify(response.data)}`);
        this._transport.token = response.data.token;
        return this._transport.token;
      })
      .catch((error) => {
        debug(`Login error: ${error.message}`);
        this._transport.token = undefined;
        throw error;
      });
  }

  whoami() {
    return this._transport.emit('whoami');
  }


  /**
   * Logout
   * @return {Promise}
   */
  logout() {
    invariant(_.isString(this.token), 'you are not logged in, jwt token missing');
    this._transport._token = undefined;
    return this._transport.disconnect();
  }
}

module.exports = Authentication;
