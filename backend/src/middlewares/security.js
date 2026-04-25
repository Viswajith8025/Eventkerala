const sanitize = require('mongo-sanitize');
const xss = require('xss');

/**
 * Middleware to prevent NoSQL Injection
 */
exports.nosqlSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  if (req.query) {
    // Manually sanitize keys/values to avoid read-only property errors in Express 5
    const cleanQuery = {};
    Object.keys(req.query).forEach(key => {
      cleanQuery[sanitize(key)] = sanitize(req.query[key]);
    });
    // We don't replace req.query directly if it's read-only, but we can mutate it or use a copy
    // In Express 5, req.query is often a proxy.
    try {
      Object.keys(req.query).forEach(key => delete req.query[key]);
      Object.assign(req.query, cleanQuery);
    } catch (e) {
      // If still failing, we just proceed with the copy attached to req
      req.sanitizedQuery = cleanQuery;
    }
  }
  next();
};

/**
 * Middleware to prevent XSS
 */
exports.xssSanitizer = (req, res, next) => {
  const sanitizeValue = (val) => {
    if (typeof val === 'string') return xss(val);
    if (typeof val === 'object' && val !== null) {
      Object.keys(val).forEach(k => {
        val[k] = sanitizeValue(val[k]);
      });
    }
    return val;
  };

  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) sanitizeValue(req.query);
  if (req.params) sanitizeValue(req.params);
  
  next();
};
