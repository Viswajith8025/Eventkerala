const sanitize = require('mongo-sanitize');
const xss = require('xss');

/**
 * Middleware to prevent NoSQL Injection
 */
exports.nosqlSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  if (req.query) {
    const cleanQuery = sanitize(req.query);
    // Express query is often a getter/setter object, so we try to replace keys
    try {
      for (const key in req.query) {
        delete req.query[key];
      }
      Object.assign(req.query, cleanQuery);
    } catch (e) {
      // Fallback: attach to req if query object is frozen
      req.query = cleanQuery;
    }
  }
  next();
};

/**
 * Middleware to prevent XSS
 */
exports.xssSanitizer = (req, res, next) => {
  const cleanXSS = (val) => {
    if (typeof val === 'string') return xss(val);
    if (Array.isArray(val)) return val.map(cleanXSS);
    if (typeof val === 'object' && val !== null) {
      const cleanObj = {};
      for (const key in val) {
        cleanObj[key] = cleanXSS(val[key]);
      }
      return cleanObj;
    }
    return val;
  };

  if (req.body) req.body = cleanXSS(req.body);
  if (req.query) req.query = cleanXSS(req.query);
  if (req.params) req.params = cleanXSS(req.params);
  
  next();
};
