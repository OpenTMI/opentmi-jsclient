// 3rd party modules
const SocketIO = require('socket.io-client');
const axios = require('axios');
const Promise = require('bluebird');
const invariant = require('invariant');
const _ = require('lodash');

// application modules
const {debug, timeSince} = require('../utils');


class Transport {
  /**
   * Constructor for default transport layer
   * @param {String}host opentmi uri
   * @param {Axios}Rest axios(default) -kind of object which provide REST API
   * @param {SocketIO}IO   socket.io-client(default) -kind of object which provide event based communication
   */
  constructor(host = '', Rest = axios, IO = SocketIO) {
    this.Rest = Rest;
    this.IO = IO;
    this._token = undefined;
    this._host = host;
    this._latency = undefined;
    this._ioRequests = {};
    this._sockets = {};
  }

  get _socket() {
    return _.get(this._sockets, '');
  }

  /**
   * get authentication token
   * @return {string} returns token
   */
  get token() {
    return this._token;
  }

  /**
   * set new token
   * @param {string} token set token
   */
  set token(token) {
    invariant(_.isUndefined(token) || _.isString(token), 'You should call login() first');
    this._token = token;
  }

  /**
   * get current latency based on IO ping-pong packages
   * @return {float} returns IO latency
   */
  get latency() {
    return this._latency;
  }

  /**
   * Check if we have logged in - and have a token
   * @return {boolean} returns true have token
   */
  get isLoggedIn() {
    return _.isString(this.token);
  }

  /**
   * Check if IO is connected
   * @return {boolean} returns true when IO is connected
   */
  get isConnected() {
    return !_.isUndefined(this._socket);
  }

  get _headers() {
    return this.isLoggedIn ? {Authorization: `Bearer ${this.token}`} : {};
  }

  _url(path = '') {
    return `${this._host}${path}`;
  }

  /**
   * Connect socketIO
   * @param {string} namespace - optional namespace
   * @return {Promise} resolves IO connection
   */
  connect(namespace = '') {
    return new Promise((resolve, reject) => {
      invariant(this.isLoggedIn, 'token is not configured');
      debug('Create socketIO connection');
      const options = {
        query: `token=${this.token}`
      };
      const sioUrl = `${this._url()}${namespace}`;
      debug(`socketIO url: ${sioUrl}, options: ${JSON.stringify(options)}`);
      const socket = this.IO(sioUrl, options);
      socket.once('connect', () => resolve(socket));
      socket.once('reconnect', () => {
        debug('reconnecting');
      });
      socket.once('connect_error', reject);
      this._sockets[namespace] = socket;
    }).then((socket) => {
      debug('SocketIO connected');
      socket.on('error', (error) => {
        debug(error);
      });
      socket.on('reconnect', () => {
        debug('socketIO reconnect');
      });
      socket.on('reconnect_attempt', () => {
        debug('socketIO reconnect_attempt');
      });
      socket.on('reconnecting', (attempt) => {
        debug(`socketIO reconnecting, attempt: ${attempt}`);
      });
      socket.on('reconnect_error', (error) => {
        debug(error);
      });
      socket.on('reconnect_failed', (error) => {
        debug(error);
      });
      socket.on('exit', () => {
        debug('Server is attemt to exit...');
      });
      socket.on('pong', (latency) => {
        this._latency = latency;
        debug(`pong latency: ${latency}ms`);
      });
      return socket;
    })
      .catch((error) => {
        debug(`socketIO connection fails: ${error.message}`);
        throw error;
      });
  }
  /**
   * Disconnect SIO
   * @return {Promise} resolves when IO is disconnected
   */
  disconnect() {
    const nss = Object.keys(this._sockets);
    const pending = _.map(nss, ns => this.disconnectNamespace(ns));
    return Promise.all(pending);
  }

  disconnectNamespace(namespace = '') {
    debug(`Disconnecting ns: ${namespace}`);
    const socket = _.get(this._sockets, namespace);
    return new Promise((resolve) => {
      invariant(socket, 'socket is not open');
      socket.once('disconnect', resolve);
      socket.disconnect();
    })
      .then(() => {
        debug('SocketIO disconnected');
        _.unset(this._sockets, namespace);
      });
  }

  /**
   * low level request for IO channel
   * @param {object} req - event: <string>, data: <object>[, timeout: <number]
   * @returns {Promise} resolves when response is received
   */
  requestIO(req) {
    /* class IOResponse {
      constructor(req) {
        this.Request = req;
        this._time = new Date();
      }
      setResponse(data) {
        this.Response = data;
      }
    } */
    invariant(_.isObject(this._socket), 'Should be Connected');
    invariant(_.isString(this._token), 'you are not logged in, jwt token missing');
    invariant(_.isPlainObject(req), 'request should be object');
    _.defaults(req, {timeout: 600000, data: {}, time: new Date()});
    invariant(_.isString(req.event), 'event should be string');
    invariant(_.isPlainObject(req.data), 'data should be object');
    invariant(_.isNumber(req.timeout), 'timeout should be number');
    debug(`requestIO: ${JSON.stringify(req)}`);
    this._ioRequests[req.time] = req;
    const pending = new Promise((resolve, reject) => {
      this._socket.emit(req.event, req.data, (error, data) => {
        if (pending.isPending()) {
          debug(`Response in ${(new Date() - req.time)}ms`);
          if (error) reject(error);
          else resolve(data);
        } else {
          debug('Response received too late - Promise was rejected already');
        }
      });
    })
      .timeout(req.timeout)
      .catch(Promise.TimeoutError, (error) => {
        throw error;
      })
      .finally(() => {
        delete this._ioRequests[req.time];
      });
    return pending;
  }
  /**
   * Event emitter to the server
   * @param {string} event - event name
   * @param {object} data - optional data
   * @param {number} timeout - optional timeout
   * @return {Promise} resolves when emit is done
   */
  emit(event, data = {}, timeout = undefined) {
    invariant(_.isString(event), 'event should be a string');
    return this.requestIO({event, data, timeout});
  }
  /**
   * REST request API
   * @param {object} req - axios config -kind of object.
   * default parameters:
   * url: '/',
   * method: 'get'
   * @returns {Promise} resolves when request success
   */
  request(req) {
    const {CancelToken} = this.Rest;
    const source = CancelToken.source();
    const config = _.defaults(req, {
      url: '/',
      method: 'get',
      baseURL: this._host,
      headers: this._headers,
      cancelToken: source.token
    });
    debug(`Requesting: ${JSON.stringify(config)}`);
    const startTime = new Date();
    return Promise.try(() => this.Rest
      .request(config)
      .then((data) => {
        const duration = timeSince(startTime);
        debug(`Request finished in ${duration.milliseconds}ms`);
        return data;
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const data = _.get(error, 'response.data', {message: error.message});
          debug(`Request fails with status ${error.response.status}, ${JSON.stringify(data)}`);
          if (error.response.status === 503) {
            const retryAfterSeconds = _.get(data, 'retryAfter', 2);
            req.retryCount = _.get(req, 'retryCount', 1) - 1;
            if (req.retryCount > 0) {
              return Promise
                .delay(retryAfterSeconds * 1000)
                .then(() => this.request(req));
            }
          }
          _.set(
            error, 'message',
            _.get(
              error, 'response.data.message', // take message by default
              _.get(
                error, 'response.data.error', // then error if message not exists
                error.message // last option to take original request failure reason
              )
            )
          );
        } else if (this.Rest.isCancel(error)) {
          debug(`Request canceled: ${error.message}`);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          debug(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          debug('Error', error.message);
        }
        throw error;
      }));
    // source.cancel('Operation canceled by the user
  }

  /**
   * HTTP Get request to server
   * @param {string} url - path to the server
   * @param {object} params - query parameters
   * @return {Promise} - resolves response object
   */
  get(url, params) {
    return this.request({url, params});
  }

  /**
   * HTTP post request to server
   * @param {string} url - path to the server
   * @param {object} data - optional json data
   * @param {object} headers - optional headers as json object
   * @return {Promise} - resolves response object
   */
  post(url, data, headers = undefined) {
    return this.request({
      url, method: 'post', data, headers
    });
  }

  /**
   * Put request
   * @param {String}url uri for request
   * @param {object}data json object to be send
   * @param {object}params json object for query parameters
   * @return {Promise} - resolves response object
   */
  put(url, data, params) {
    return this.request({
      url, method: 'put', params, data
    });
  }

  /**
   * delete request
   * @param {String}url uri for request
   * @return {Promise} - resolves response object
   */
  delete(url) {
    return this.request({url, method: 'delete'});
  }

  /**
   * get socketIO instance
   * @param {String}namespace namespace which socket to be get
   * @return {Promise<SocketIO-client>} resolves SocketIO-client object for namespace
   */
  sio(namespace = '') {
    const socket = _.get(this._sockets, namespace);
    return socket ? Promise.resolve(socket) : Promise.reject(new Error('No socket open for this namespace'));
  }
}

module.exports = Transport;
