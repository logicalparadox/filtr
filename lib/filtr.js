/**
 * filtr - MongoDB inspired array filtering
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * @see https://github.com/logicalparadox/filtr
 * MIT Licensed
 */

var traversable = {
    $and: true
  , $or: true
  , $nor: true
}

function _defaults (a, b) {
  if (a && b) {
    for (var key in b) {
      if ('undefined' == typeof a[key])
        a[key] = b[key];
    }
  }
  return a;
}

module.exports = Filtr;

function Filtr (query) {
  if (global == this)
    return new Filtr(query);

  this.query = query;
  this.stack = this.parseQuery(query);
}

Filtr.version = '0.1.0';

Filtr.comparators = {
  $gt: function (a, b) {
    return a > b;
  }

  , $gte: function (a, b) {
    return a >= b;
  }

  , $lt: function (a, b) {
    return a < b;
  }

  , $lte: function (a, b) {
    return a <= b;
  }

  , $all: function (a, b) {
    for (var i = 0; i < b.length; i++) {
      if (!~a.indexOf(b[i])) return false;
    }
    return true;
  }

  , $exists: function (a, b) {
    return !!a == b;
  }

  , $mod: function (a, b) {
    return a % b[0] == b[1];
  }

  , $eq: function (a, b) {
    return a == b;
  }

  , $ne: function (a, b) {
    return a != b;
  }

  , $in: function (a, b) {
    return ~b.indexOf(a) ? true : false;
  }

  , $nin: function (a, b) {
    return ~b.indexOf(a) ? false : true;
  }

  , $size: function (a, b) {
    return (a.length && b) ? a.length == b : false;
  }

  , $or: function (a) {
    var res = false;
    for (var i = 0; i < a.length; i++) {
      var fn = a[i];
      if (fn) res = true;
    }
    return res;
  }

  , $nor: function (a) {
    var res = true;
    for (var i = 0; i < a.length; i++) {
      var fn = a[i];
      if (fn) res = false;
    }
    return res;
  }

  , $and: function (a) {
    var res = true;
    for (var i = 0; i < a.length; i++) {
      var fn = a[i];
      if (!fn) res = false;
    }
    return res;
  }
};

Filtr.parsePath = function (path) {
  var parts = path.split('.').filter(Boolean);
  return parts.map(function (value) {
    var re = /([A-Za-z0-9]+)\[(\d+)\]$/
      , mArr = re.exec(value)
      , val;
    if (mArr) val = { p: mArr[1], i: mArr[2] };
    return val || value;
  });
};

Filtr.getPathValue = function (parsed, obj) {
  var tmp = obj
    , res;
  for (var i = 0, l = parsed.length; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('object' === typeof part && tmp[part.p]) {
        tmp = tmp[part.p][part.i];
      } else {
        tmp = tmp[part];
      }
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
};

Filtr.prototype.test = function (data, opts) {
  var defaults = {
          type: 'set' // set || single
        , spec: 'subset' // subset || boolean || index
      }
    , options = _defaults(opts || {}, defaults)
    , res = (options.type == 'single') ? false : []
    , filter
    , el;
  if (options.type == 'single') data = [ data ];
  for (var di = 0, dl = data.length; di < dl; di++) {
    var datum = data[di]
      , pass = true;
    for (var si = 0, sl = this.stack.length; si < sl; si++) {
      filter = this.stack[si];
      el = (filter.path) ? Filtr.getPathValue(filter.path, datum) : datum;
      if (!this.testFilter(el, filter.test)) pass = false;
    }
    if (options.type == 'single') {
      res = pass;
    } else {
      switch (options.spec) {
        case 'boolean':
          res.push(pass);
          break;
        case 'index':
          if (pass) res.push(di);
          break;
        default:
          if (pass) res.push(datum);
          break;
      }
    }
  }
  return res;
};

Filtr.prototype.parseQuery = function (query) {
  var stack = [];
  for (var cmd in query) {
    var qry = {}
      , params = query[cmd];
    if (cmd[0] == '$') {
      qry.test = this.parseFilter(query);
    } else {
      qry.test = this.parseFilter(params);
      qry.path = Filtr.parsePath(cmd);
    }
    stack.push(qry);
  }
  return stack;
};

Filtr.prototype.parseFilter = function (query) {
  var stack = [];
  for (var test in query) {
    var fn = Filtr.comparators[test]
      , params = query[test]
      , traverse = false;
    if (traversable[test]) {
      var st = [];
      for (var i = 0; i < params.length; i++)
        st.push(this.parseFilter(params[i]));
      traverse = true;
    }
    stack.push({
        fn: fn
      , params: traverse ? st : params
      , traverse: traverse
    });
  }
  return stack;
};

Filtr.prototype.testFilter = function (val, stack) {
  var res = true;
  for (var i = 0; i < stack.length; i++) {
    var test = stack[i]
      , params = test.params;
    if (test.traverse) {
      var p = [];
      for (var ii = 0; ii < params.length; ii++) {
        var t = params[ii];
        p.push(this.testFilter(val, t));
      }
      params = p;
    }
    if (test.fn.length == 1) {
      if (!test.fn(params)) res = false;
    } else {
      if (!test.fn(val, params)) res = false;
    }
  }
  return res;
};
