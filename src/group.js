/** @module Groups */
// 3rd party modules
// application modules
const {Document} = require('./utils');


class Group extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   */
  constructor(transport, groupJson) {
    super(transport, `/api/v0/groups/${groupJson._id}`, groupJson);
  }

  static fromId(transport, id) {
    const group = new Group(transport, {_id: id});
    return group.refresh();
  }

  /**
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.name}`;
  }

  /**
   * Get group name
   * @return {String}
   */
  get name() { return this.get('name'); }

  /**
   * Check if group is a admin
   * @return {boolean}
   */
  isAdmin() {
    return this.name() === 'admin';
  }
}

module.exports = Group;
