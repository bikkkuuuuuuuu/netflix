const RateLimiterService = require("../services/rateLimiter.service");

function rateLimiter(options = {}) {
  const {
    capacity = 100,
    refillRate = 10,
    refillInterval = 1000,
    keyPrefix = "rate-limit",
    tokensRequired = 1,
  } = options;

  return async (req, res, next) => {
    try {
      const identifier =
        req.authUser?._id.toString() ||
        req.ip ||
        req.socket.remoteAddress ||
        "unknown";
      const key = `${keyPrefix}:${identifier}`;
      const result = await RateLimiterService.consume({
        key,
        capacity,
        refillRate,
        refillInterval,
        tokensRequired,
      });
      res.setHeader("X-RateLimit-Limit", capacity);

      res.setHeader("X-RateLimit-Remaining", result.remaining);
      if (!result.allowed) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      }
      next();
    } catch (exception) {
      console.error("Rate limiter error:", exception);

      // Fail open
      next();
    }
  };
}

module.exports = rateLimiter;
