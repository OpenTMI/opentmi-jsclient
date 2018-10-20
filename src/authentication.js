const invariant = require('invariant');
const _ = require('lodash');
const Promise = require('bluebird');

// application modules
const {debug} = require('./utils');

/**
 * Authentication controller
 * This class provides login API's like login, logout
 * @example
 * const auth = new Authentication(transport);
 * auth
 *   .login('user@email.com', 'password')
 *   .whoami().then(user => console.log(user.toString()));
 */
class Authentication {
  /**
   * Constructor for Authentication controller
   * @param {Transport} transport - transport layer for communication
   */
  constructor(transport) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
  }

  /**
   * Login to OpenTMI
   * @param {string}email user email address
   * @param {string}password user password
   * @return {Promise.<string>} - return a token
   */
  login(email, password) {
    invariant(!_.isString(this._transport.token), 'is logged out alread!');
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

  /**
   * Login using access token
   * @param {string}token service authentication token
   * @param {string}service token service, default: Github
   * @return {Promise<string>} - return token
   */
  loginWithToken(token, service='github') {
    invariant(!_.isString(this._transport.token), 'is logged out alread!');
    invariant(_.isString(token), 'token should be string');
    invariant(_.isString(service), 'service should be string');
    return this._transport
      .post(`/auth/${service}/token`, {token}, {})
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

  /**
   * Find out who I'm.
   * Returns plain object with some details about yourself.
   * @return {Promise<object>} resolves user details
   */
  whoami() {
    return this._transport.emit('whoami');
  }

  /**
   * Logout
   * @return {Promise} resolves when logged out succesfully
   */
  logout() {
    invariant(_.isString(this._transport.token), 'you are not logged in, jwt token missing');
    this._transport._token = undefined;
    return this._transport.isConnected ?
      this._transport.disconnect() : Promise.resolve();
  }
}

module.exports = Authentication;
