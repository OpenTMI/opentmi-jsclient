/**
 * A module that exports all straight API's!
 * @module API
 */
const Authentication = require('./authentication');
const Schemas = require('./schemas');
const Admin = require('./admin');
const Users = require('./users');
const Cluster = require('./cluster');
const Resources = require('./resources');
const Resource = require('./resource');
const Results = require('./results');
const Result = require('./result');
const utils = require('./utils');
const Transport = require('./transports');

module.exports = {
  Authentication,
  Schemas,
  Admin,
  Users,
  Cluster,
  Resources,
  Resource,
  Results,
  Result,
  utils,
  Transport
};
