const assert = require('assert');
const moxios = require('moxios');

const {Transport, Users, User} = require('../../src');

describe('Users', function () {
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
    const users = new Users(transport);
    assert.ok(users);
  });
  it('update is not implemented', function () {
    const users = new Users(transport);
    return users.update()
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  describe('User', function () {
    it('basics', function () {
      const user = new User(transport, {_id: '123', name: 'aa'});
      assert.equal(user.name, 'aa');
      assert.equal(user.email('mail').email(), 'mail');
      assert.equal(`${user}`, 'aa');
    });
    it('isAdmin', function () {
      const user = new User(transport, {_id: '123', name: 'aa'});
      return user.isAdmin()
        .then(yes => assert.equal(yes, false));
    });
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/users', {
        status: 200,
        response: []
      });
      const users = new Users(transport);
      transport.token = 'abc';
      const find = users.find();
      return find.exec();
    });
    it('apis', function () {
      const users = new Users(transport);
      const find = users.find()
        .id('me');
      assert.ok(find);
    });
    it('WHOAMI', function () {
      moxios.stubRequest('/auth/me', {
        status: 200,
        response: {_id: '123'}
      });
      return Users.WHOAMI(transport);
    });
  });
});
