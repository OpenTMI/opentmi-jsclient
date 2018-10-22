const assert = require('assert');
const moxios = require('moxios');

const {Transport, Items, Item} = require('../../src');

describe('Items', function () {
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
    const items = new Items(transport);
    assert.ok(items);
  });
  it('update is not implemented', function () {
    const items = new Items(transport);
    return items.update()
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  describe('Item', function () {
    it('basics', function () {
      const item = new Item(transport);
      assert.equal(item.name('aa').name(), 'aa');
      assert.equal(item.barcode('abc').barcode(), 'abc');
      assert.equal(item.category('cat').category(), 'cat');
      assert.equal(item.manufacturer('cm').manufacturer(), 'cm');
      assert.equal(item.imageSrc('url').imageSrc(), 'url');
      assert.equal(item.description('note').description(), 'note');
      assert.equal(item.reference('link').reference(), 'link');
      assert.equal(`${item}`, 'cat: cm - aa');
    });
    it('getImage', function () {
      moxios.stubRequest('/api/v0/items/123/image', {
        status: 200,
        response: ''
      });
      const item = new Item(transport, {_id: '123'});
      return item.getImage();
    });
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/items?', {
        status: 200,
        response: []
      });
      const items = new Items(transport);
      transport.token = 'abc';
      const find = items.find();
      return find.exec();
    });
    it('apis', function () {
      const item = new Items(transport);
      const find = item.find()
        .name('me')
        .available(1)
        .available()
        .categoryAccessories()
        .categoryBoards()
        .categoryComponents()
        .categoryOthers()
        .manufacturer('abc');
      assert.ok(find);
    });
  });
});
