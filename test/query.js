if (!chai) var chai = require('chai');
var should = chai.should();

if (!filtr) var filtr = require('..');

describe('Query', function () {
  it('should have a version', function () {
    filtr.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('should parse a single query', function () {
    var query = { $lt: 10 }
      , Q = filtr(query);
    Q.stack.should.have.length(1);
    Q.test(8, { type: 'single' }).should.be.true;
    Q.test(11, { type: 'single' }).should.be.false;
  });

  it('should parse a lengthed query', function () {
    var query = { $lt: 10, $gt: 5 }
      , Q = filtr(query);
    Q.stack.should.have.length(2);
    Q.test(8, { type: 'single' }).should.be.true;
    Q.test(4, { type: 'single' }).should.be.false;
    Q.test(11, { type: 'single' }).should.be.false;
  });

  it('should parse a nested query', function () {
    var query = { $and: [ { $size: 3 }, { $all: [ 1, 2 ] } ] }
      , Q = filtr(query);
    Q.stack.should.have.length(1);
    Q.stack[0].test.should.be.instanceof(Array);
    Q.test([0,1,2], { type: 'single' }).should.be.true;
  });

  it('should provide the getPathValue helper', function () {
    var obj = { hello: { universe: 'world' }}
      , val = filtr.getPathValue('hello.universe', obj);
    val.should.equal('world');
  });

  describe('setPathValue', function () {
    it('should allow value to be set in simple object', function () {
      var obj = {};
      filtr.setPathValue('hello', 'universe', obj);
      obj.should.eql({ hello: 'universe' });
    });

    it('should allow value to be REset in simple object', function () {
      var obj = { hello: 'world' };
      filtr.setPathValue('hello', 'universe', obj);
      obj.should.eql({ hello: 'universe' });
    });

    it('should allow value to be set in complex object', function () {
      var obj = { hello: { }};
      filtr.setPathValue('hello.universe', 42, obj);
      obj.should.eql({ hello: { universe: 42 }});
    });

    it('should allow value to be REset in complex object', function () {
      var obj = { hello: { universe: 100 }};
      filtr.setPathValue('hello.universe', 42, obj);
      obj.should.eql({ hello: { universe: 42 }});
    });

    it('should allow for value to be set in array', function () {
      var obj = { hello: [] };
      filtr.setPathValue('hello[0]', 1, obj);
      obj.should.eql({ hello: [1] });
      filtr.setPathValue('hello[2]', 3, obj);
      obj.should.eql({ hello: [1 , , 3] });
    });

    it('should allow for value to be REset in array', function () {
      var obj = { hello: [ 1, 2, 4 ] };
      filtr.setPathValue('hello[2]', 3, obj);
      obj.should.eql({ hello: [ 1, 2, 3 ] });
    });
  });

  describe('comparator assumptions', function () {
    it('should assume $eq if no comparator provided - string', function () {
      var query = { 'hello': 'universe' }
        , Q = filtr(query);
      Q.stack.should.have.length(1);
      Q.test({ hello: 'universe' }, { type: 'single' }).should.be.true;
    });

    it('should assume $eq if no comparator provided - number', function () {
      var query = { 'hello': 42 }
        , Q = filtr(query);
      Q.stack.should.have.length(1);
      Q.test({ hello: 42 }, { type: 'single' }).should.be.true;
    });

    it('should assume $eq if no comparator provided - boolean', function () {
      var query = { 'hello': true }
        , Q = filtr(query);
      Q.stack.should.have.length(1);
      Q.test({ hello: true }, { type: 'single' }).should.be.true;
    });
  });

  // TODO: More complicated nesting
  // TODO: All nesting options.

});
