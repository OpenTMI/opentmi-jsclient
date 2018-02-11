// 3rd party modules
const invariant = require('invariant');

// application modules
const Testcase = require('./testcase');
const {
  QueryBase,
  Collection,
  Document,
  notImplemented
} = require('./utils');

/**
 * @class TestcasesQuery
 */
class TestcasesQuery extends QueryBase {
  /**
   * Find testcases by id
   * @param {String}id testcase id
   * @return {ItemsQuery} returns this
   */
  tcid(id) {
    return this.has({tcid: `/${id}/`});
  }

  /**
   * Test case is marked as skip
   * @return {TestcasesQuery} returns this
   */
  isSkip() {
    return this.has({'execution.skip': true});
  }

  /**
   * Test case is marked as archived
   * @return {TestcasesQuery} returns this
   */
  isArchived() {
    return this.has({'archive.value': true});
  }

  /**
   * Find tests with type
   * @param {String}type test case type e.g. smoke, acceptance,...
   * @return {TestcasesQuery} returns this
   */
  type(type) {
    const ALLOWED_TYPES = [
      'installation',
      'compatibility',
      'smoke',
      'regression',
      'acceptance',
      'alpha',
      'beta',
      'stability',
      'functional',
      'destructive',
      'performance',
      'reliability'
    ];
    invariant(ALLOWED_TYPES.indexOf(type) !== 0, 'not allowed type');
    return this.has({'other_info.type': type});
  }
}

class Testcases extends Collection {
  /**
   * Constructor for Items model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/testcases');
    this._notImplemented = notImplemented;
  }

  /**
   * Find Testcases
   * @return {TestcasesQuery} returns Query object
   */
  find() {
    return new TestcasesQuery(this, Testcase);
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented('Item update is not implemented');
  }

  /**
   * Create new test case
   * @return {Testcase} returns new test case without id
   */
  create() {
    const NewTestcase = Document.IsNewDocument(Testcase);
    return new NewTestcase(this._transport);
  }
}

module.exports = Testcases;
