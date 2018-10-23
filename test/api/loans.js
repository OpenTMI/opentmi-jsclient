const {expect} = require('chai');
const moxios = require('moxios');

const {Transport, Loans, Loan} = require('../../src');

describe('Loans', function () {
  let transport;
  beforeEach(function () {
    // import and pass your custom axios instance to this method
    moxios.install();
    transport = new Transport();
  });

  afterEach(function () {
    // import and pass your custom axios instance to this method
    moxios.uninstall();
  });
  it('is ok', function () {
    const loans = new Loans(transport);
    expect(loans).to.be.ok;
  });
  it('update is not implemented', function () {
    const loans = new Loans(transport);
    return loans.update()
      .reflect()
      .then((promise) => {
        expect(promise.isRejected()).to.be.true;
      });
  });
  it('get user loan', function () {
    moxios.stubRequest('/api/v0/loans?q=%7B%22loaner%22:%22123%22%7D', {
      status: 200,
      response: [{_id: '1'}]
    });
    transport.token = 'abc';
    const user = {id: '123'};
    return Loans.forUser(user, transport)
      .then((loans) => {
        expect(loans).to.be.an('array');
        expect(loans.length).to.be.equal(1);
        expect(loans[0].id).to.be.equal('1');
      });
  });
  describe('create', function () {
    it('basics', function () {
      const loan = new Loan(transport);
      const date = new Date();
      expect(loan.loanDate(date).loanDate()).to.be.equal(date);
      expect(loan.loaner('aa').loaner()).to.be.equal('aa');
      expect(loan.notes('jes').notes()).to.be.equal('jes');
      expect(`${loan}`).to.be.equal('aa');
      const loanItem = loan.newLoanItem();
      loanItem.item = {id: 'itemId', _id: 'itemId'};
      loanItem.resource = {id: 'rid', _id: 'rid'};
      loan.addItem(loanItem);
      const loanItems = loan.loanItems();
      const item0 = loanItems[0];
      transport.token = '123';
      moxios.stubRequest('/api/v0/resources?q=%7B%22_id%22:%22rid%22%7D', {
        status: 200,
        response: [{_id: 'rid'}]
      });
      moxios.stubRequest('/api/v0/items?q=%7B%22_id%22:%22itemId%22%7D', {
        status: 200,
        response: [{_id: 'itemId'}]
      });
      return Promise.all([item0.getItem(), item0.getResource()])
        .then(([item, resource]) => {
          expect(resource.id).to.be.equal('rid');
          expect(item.id).to.be.equal('itemId');
        });
    });
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/loans', {
        status: 200,
        response: []
      });
      transport.token = 'abc';
      const loans = new Loans(transport);
      return loans.find().exec();
    });
    it('apis', function () {
      const loans = new Loans(transport);
      const find = loans.find();
      find.hasNotes('ab')
        .loadItems()
        .loadLoaner()
        .loadResources()
        .loanDate(new Date())
        .loaner('cat');
    });
  });
});
