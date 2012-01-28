var comparator = module.exports = {};

comparator.$gt = function (a, b) {
  return a > b;
};

comparator.$gte = function (a, b) {
  return a >= b;
};

comparator.$lt = function (a, b) {
  return a < b;
};

comparator.$lte = function (a, b) {
  return a <= b;
};

comparator.$all = function (a, b) {
  for (var i = 0; i < b.length; i++) {
    if (!~a.indexOf(b[i])) return false;
  }
  return true;
};

comparator.$exists = function (a, b) {
  return !!a == b;
};

comparator.$mod = function (a, b) {
  return a % b[0] == b[1];
};

comparator.$eq = function (a, b) {
  return a == b;
};

comparator.$ne = function (a, b) {
  return a != b;
};

comparator.$in = function (a, b) {
  return ~b.indexOf(a) ? true : false;
};

comparator.$nin = function (a, b) {
  return ~b.indexOf(a) ? false : true;
};

comparator.$size = function (a, b) {
  return (a.length && b) ? a.length == b : false;
};

comparator.$or = function (a) {
  var res = false;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = true;
  }
  return res;
};

comparator.$nor = function (a) {
  var res = true;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (fn) res = false;
  }
  return res;
};

comparator.$and = function (a) {
  var res = true;
  for (var i = 0; i < a.length; i++) {
    var fn = a[i];
    if (!fn) res = false;
  }
  return res;
};
