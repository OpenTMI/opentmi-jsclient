// 3rd party modules
const SocketIO = require('socket.io-client');
const axios = require('axios');
const invariant = require('invariant');
const _ = require('lodash');
// application modules
const {debug} = require('../utils');


class Transport {
  /**
   * Constructor for default transport layer
   * @param Rest axios(default) -kind of object which provide REST API
   * @param IO   socket.io-client(default) -kind of object which provide event based communication
   */
  constructor(host = '', Rest = axios, IO = SocketIO) {
    this.Rest = Rest;
    this.IO = IO;
    this._token = undefined;
    this._host = host;
    this._latency = undefined;
    this._ioRequests = {};
  }
  /**
   * get authentication token
   * @return {string}
   */
  get token() {
    return this._token;
  }

  /**
   * set new token
   * @param {string} token
   */
  set token(token) {
    invariant(_.isUndefined(this._socket), 'You should call disconnect() first');
    this._token = token;
  }

  /**
   * get current latency based on IO ping-pong packages
   * @return {float}
   */
  get latency() {
    return this._latency;
  }

  /**
   * Check if we have logged in - and have a token
   * @return {boolean}
   */
  get isLoggedIn() {
    return _.isString(this.token);
  }

  /**
   * Check if IO is connected
   * @return {boolean}
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
   * @return {Promise}
   */
  connect(namespace = '') {
    return new Promise((resolve, reject) => {
      invariant(this._token, 'token is not configured');
      debug('Create socketIO connection');
      const options = {
        query: `token=${this._token}`
      };
      const sioUrl = `${this._url()}${namespace}`;
      debug(`socketIO url: ${sioUrl}`);
      this._socket = this.IO(sioUrl, options);
      this._socket.once('connect', resolve);
      this._socket.once('reconnect', resolve);
      this._socket.once('connect_error', reject);
    }).then(() => {
        debug('SocketIO connected');
        this._socket.on('error', (error) => {
          debug(error);
        });
        this._socket.on('reconnect', () => {
          debug('socketIO reconnect');
        });
        this._socket.on('reconnect_attempt', () => {
          debug('socketIO reconnect_attempt');
        });
        this._socket.on('reconnecting', (attempt) => {
          debug(`socketIO reconnecting, attempt: ${attempt}`);
        });
        this._socket.on('reconnect_error', (error) => {
          debug(error);
        });
        this._socket.on('reconnect_failed', (error) => {
          debug(error);
        });
        this._socket.on('exit', () => {
          debug('Server is attemt to exit...');
        });
        this._socket.on('pong', (latency) => {
          this._latency = latency;
          debug(`pong latency: ${latency}ms`);
        });
        return this._socket;
      })
      .catch((error) => {
        debug(`socketIO connection fails: ${error.message}`);
        throw error;
      });
  }
  /**
   * Disconnect SIO
   * @return {Promise}
   */
  disconnect() {
    return new Promise((resolve) => {
      invariant(this._socket, 'token is not configured');
      this._socket.once('disconnect', resolve);
      this._socket.disconnect();
    })
      .then(() => {
        debug('SocketIO disconnected');
      });
  }

  /**
   * low level request for IO channel
   * @param {object} req - event: <string>, data: <object>[, timeout: <number]
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
   * @return {*}
   */
  emit(event, data = {}, timeout = undefined) {
    return this.requestIO({event, data, timeout});
  }
  /**
   * REST request API
   * @param {object} req - axios config -kind of object.
   * default parameters:
   * url: '/',
   * method: 'get'
   */
  request(req) {
    const CancelToken = this.Rest.CancelToken;
    const source = CancelToken.source();
    const config = _.defaults(
      req, {
        url: '/',
        method: 'get',
        baseURL: this._host,
        headers: this._headers,
        cancelToken: source.token
      });
    debug(`Requesting: ${JSON.stringify(config)}`);
    return this.Rest
      .request(config)
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
          throw new Error(data.message);
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
      });
    // source.cancel('Operation canceled by the user
  }

  /**
   * HTTP Get request to server
   * @param {string} url - path to the server
   * @param {object} data - json data
   * @return {Promise}
   */
  get(url, data = undefined) {
    return this.request({url, data});
  }
  /**
   * HTTP post request to server
   * @param {string} url - path to the server
   * @param {object} data - optional json data
   * @param {object} headers - optional headers as json object
   * @return {Promise}
   */
  post(url, data, headers = undefined) {
    return this.request({url, method: 'post', data, headers});
  }
  update(url, data) {
    return this.request({url, method: 'update', data});
  }
  delete(url) {
    return this.request({url, method: 'delete'});
  }
  /**
   * get socketIO instance
   * @return {SocketIO-client}
   */
  get sio() {
    invariant(this._socket, 'You should call Connect first');
    return this._socket;
  }
}

module.exports = Transport;
