// application modules
const {Document} = require('./utils');


class Loan extends Document {
  /**
   * Manage single resource
   * @param {Transport} transport - transport layer
   * @param {object} resourceJson - plain json object
   */
  constructor(transport, resourceJson) {
    super(transport, `/api/v0/loans/${resourceJson.id}`, resourceJson);
  }

  /**
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.loaner()}`;
  }

  /**
   * Get item name or set it
   * @return {Item|string}
   */
  loanDate(value) { return this.getOrSet('loan_date', value); }
  loaner(value) { return this.getOrSet('loaner', value); }
  notes(value) { return this.getOrSet('notes', value); }
  items(value) { return new LoanItems(this._transport); }

  /*
  item: {type: ObjectId, ref: 'Item', required: true},
  return_date: {
    type: Date,
    validate: {
      validator: isValidDate,
      message: '{VALUE} cannot be parsed to a date.'
    }},
  resource: {type: ObjectId, ref: 'Resource'}
  */
}

module.exports = Loan;
