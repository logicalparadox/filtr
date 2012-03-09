module.exports = (process && process.env && process.env.FILTR_COV)
  ? require('./lib-cov/filtr')
  : require('./lib/filtr');
