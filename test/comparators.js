if (!chai) var chai = require('chai');
var should = chai.should();

if (!filtr) var filtr = require('..');
var comparator = filtr.comparators;

describe('comparator', function () {

  it('should have a version', function () {
    filtr.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('$gt should work', function () {
    comparator.$gt(1,0).should.be.true;
    comparator.$gt(0,1).should.be.false;
  });

  it('$gte should work', function () {
    comparator.$gte(1,0).should.be.true;
    comparator.$gte(1,1).should.be.true;
    comparator.$gte(0,1).should.be.false;
  });

  it('$lt should work', function () {
    comparator.$lt(0,1).should.be.true;
    comparator.$lt(1,0).should.be.false;
  });

  it('$lte should work', function () {
    comparator.$lte(0,1).should.be.true;
    comparator.$lte(1,1).should.be.true;
    comparator.$lte(1,0).should.be.false;
  });

  it('$all should work', function () {
    comparator.$all([1,2],[1,2]).should.be.true;
    comparator.$all([1], [1,2]).should.be.false;
    comparator.$all([1,2,3],[1,2]).should.be.true;
  });

  it('$exists should work', function () {
    var a = undefined
      , b = {c: 'hi'};
    comparator.$exists(a, false).should.be.true;
    comparator.$exists(a, true).should.be.false;
    comparator.$exists(b, true).should.be.true;
    comparator.$exists(b.c, false).should.be.false;
    comparator.$exists(b.a, false).should.be.true;
    comparator.$exists('hi', true).should.be.true;
  });

  it('$mod should work', function () {
    comparator.$mod(12, [12, 0]).should.be.true;
    comparator.$mod(24, [12, 0]).should.be.true;
    comparator.$mod(15, [12, 0]).should.be.false;
  });

  it('$ne should work', function () {
    comparator.$ne(12,12).should.be.false;
    comparator.$ne(12,11).should.be.true;
  });

  it('$in should work', function () {
    comparator.$in(1,[0,1,2]).should.be.true;
    comparator.$in(4,[0,1,2]).should.be.false;
  });

  it('$nin should work', function () {
    comparator.$nin(1,[0,1,2]).should.be.false;
    comparator.$nin(4,[0,1,2]).should.be.true;
  });

  it('$size should work', function () {
    comparator.$size([0,1,2], 3).should.be.true;
    comparator.$size('foo', 3).should.be.true;
    comparator.$size({ a: 1}, 1).should.be.false;
    comparator.$size({ length: 3}, 3).should.be.true;
  });

  it('$or should work', function () {
    var a = [0,1,2]
      , t1 = comparator.$size(a, 2) // fail
      , t2 = comparator.$in(1, a) // pass
      , t3 = comparator.$in(4, a); // fail
    comparator.$or([ t1, t2 ]).should.be.true;
    comparator.$or([ t1, t3 ]).should.be.false;
  });

  it('$nor should work', function () {
    var a = [0,1,2]
      , t1 = comparator.$size(a, 2) // fail
      , t2 = comparator.$in(1, a) // pass
      , t3 = comparator.$in(4, a); // fail
    comparator.$nor([ t1, t2 ]).should.be.false;
    comparator.$nor([ t1, t3 ]).should.be.true;
  });

  it('$and should work', function () {
    var a = [0,1,2]
      , t1 = comparator.$size(a, 3) // pass
      , t2 = comparator.$in(1, a) // pass
      , t3 = comparator.$in(4, a); // fail
    comparator.$and([ t1, t2 ]).should.be.true;
    comparator.$and([ t1, t3 ]).should.be.false;
  });
});
