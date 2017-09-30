const invariant = require('invariant');
const io = require('socket.io-client');
const _ = require('lodash');
const axios = require('axios');
const Promise = require('bluebird');
const debug = require('debug')('opentmi-client');

class Client {
  constructor(host = '') {
    this._host = host;
    this._token = undefined;
    this._latency = undefined;
    this._ioRequests = {};
  }
  get latency() {
    return this._latency;
  }
  get isConnected() {
    return _.isString(this._token);
  }
  get _headers() {
    return this.isConnected ? {Authorization: `Bearer ${this._token}`} : {};
  }
  requestIO(req) {
    /*class IOResponse {
      constructor(req) {
        this.Request = req;
        this._time = new Date();
      }
      setResponse(data) {
        this.Response = data;
      }
    }*/
    invariant(_.isString(this._token), "you are not logged in, jwt token missing");
    invariant(_.isPlainObject(req), 'request should be object');
    _.defaults(req, {timeout: 600000, data: {}, time: new Date()});
    invariant(_.isString(req.event), 'event should be string');
    invariant(_.isPlainObject(req.data), 'data should be object');
    invariant(_.isNumber(req.timeout), 'timeout should be number');
    debug(`requestIO: ${JSON.stringify(req)}`);
    this._ioRequests[req.time] = req;
    const pending = new Promise((resolve, reject) => {
      this._socket.emit(req.event, req.data, (error, data) => {
        if(pending.isPending()) {
          debug(`Response in ${(new Date() - req.time)}ms`)
          error ? reject(error) : resolve(data);
        } else {
          debug('Response received too late - Promise was rejected already');
        }
      });
    })
    .timeout(req.timeout)
    .catch(Promise.TimeoutError, error => {
      throw error;
    })
    .finally(() => {
      delete this._ioRequests[req.time];
    });
    return pending;
  }
  emit(event, data = {}, timeout = undefined) {
    return this.requestIO({event, data, timeout});
  }
  request(req) {
    const CancelToken = axios.CancelToken;
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
    return axios
      .request(config)
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const data = _.get(error, 'response.data', {message: error.message});
          debug(`Request fails with status ${error.response.status}, ${JSON.stringify(data)}`);
          if(error.response.status === 503) {
            const retryAfterSeconds = _.get(response, 'retryAfter', 2);
            req.retryCount = _.get(req, 'retryCount', 1)-1;
            if (req.retryCount>0) {
              return Promise
                    .delay(retryAfterSeconds*1000)
                    .then(()=> this.request(req));
            }
          }
          throw new Error(data.message);
        }
        else if (axios.isCancel(error)) {
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
    //source.cancel('Operation canceled by the user
  }
  get(url, data=undefined) {
    return this.request({url, data});
  }
  post(url, data, headers=undefined) {
    return this.request({url, method: 'post', data, headers});
  }
  update(url, data) {
    return this.request({url, method: 'update', data});
  }
  delete(url) {
    return this.request({url, method: 'delete'});
  }
  get sio() {
    invariant(this._socket, 'You should call login() first');
    return this._socket;
  }
  _url(path='') {
    return `${this._host}${path}`
  }
  login(email, password, token = undefined) {
    invariant(!_.isString(this._token), "is logged out alread!");
    if(_.isString(token)) {
      this._token = token;
      return this._connect();
    }
    invariant(_.isString(email), "email should be string");
    invariant(_.isString(password), "password should be string");
    return this
      .post('/auth/login', {email, password}, {})
      .then((response) => {
        debug(`Login response: ${JSON.stringify(response.data)}`);
        this._token = response.data.token;
        return this._connect()
      })
      .catch((error) => {
          debug(`Login error: ${error.message}`);
          this._token = undefined;
          throw error;
      });
  }
  logout() {
    invariant(_.isString(this._token), "you are not logged in, jwt token missing");
    this._token = undefined;
    return this._disconnect();
  }
  _connect(namespace='') {
    return new Promise((resolve, reject) => {
      invariant(this._token, "token is not configured");
      debug("Create socketIO connection")
      const options = {
        query: `token=${this._token}`
      };
      const sioUrl = `${this._url()}${namespace}`;
      debug(`socketIO url: ${sioUrl}`)
      this._socket = io(sioUrl, options);
      this._socket.once('connect', resolve);
      this._socket.once('reconnect', resolve);
      this._socket.once('connect_error', reject);
    })
    .then(() => {
        debug("SocketIO connected")
        this._socket.on('error', (error) => {
          debug(error);
        });
        this._socket.on('reconnect', () => {
          debug("socketIO reconnect");
        });
        this._socket.on('reconnect_attempt', () => {
          debug("socketIO reconnect_attempt");
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
        })
        this._socket.on('pong', latency => {
          this._latency=latency;
          debug(`pong latency: ${latency}ms`)
        });
        return this._socket;
    })
    .catch(error => {
      debug(`socketIO connection fails: ${error.message}`);
      throw error;
    })
  }
  _disconnect() {
    return new Promise((resolve, reject) => {
      invariant(this._socket, "token is not configured");
      this._socket.once('disconnect', resolve);
      this._socket.disconnect();
    })
    .then(() => {
        debug("SocketIO disconnected")
    });
  }
}

module.exports = Client;
