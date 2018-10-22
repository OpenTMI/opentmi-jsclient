// 3rd party modules
// application modules
const {Document} = require('./utils');


class Group extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   * @param {Object}groupJson - group as plain json
   */
  constructor(transport, groupJson) {
    super(transport, '/api/v0/groups', groupJson);
  }

  static fromId(transport, id) {
    const group = new Group(transport, {_id: id});
    return group.refresh();
  }

  /**
   * Get resource info as short string
   * @return {string} returns group data as single line
   */
  toString() {
    return `${this.name}`;
  }

  /**
   * Get group name
   * @return {String} returns group name
   */
  get name() { return this.get('name'); }

  /**
   * Check if group is a admin
   * @return {boolean} returns true if group is admin
   */
  isAdmin() {
    return this.name === 'admin';
  }
}

module.exports = Group;
