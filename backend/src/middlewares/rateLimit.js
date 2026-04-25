const rateLimit = require('express-rate-limit');

// Strict: Auth routes (login/register) — 10 req / 15 min
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many auth attempts. Try again later.' }
});

// Standard: Public API routes — 100 req / 15 min
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Rate limit exceeded.' }
});

// Relaxed: Static/read-heavy routes — 300 req / 15 min
exports.readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Rate limit exceeded.' }
});
