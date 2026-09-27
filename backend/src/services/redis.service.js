const { redis } = require("../config/redis.config");
const DEFAULT_EXPIRATION = 3600;

const getOrSetCache = async (key, cb, expiration = DEFAULT_EXPIRATION) => {
  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      return JSON.parse(cached);
    }
    const freshData = await cb();
    await redis.set(key, JSON.stringify(freshData), {
      EX: expiration,
    });
    return freshData;
  } catch (exception) {
    throw exception;
  }
};

const invalidateCache = async (keyOrPattern) => {
  try {
    //key
    if (!keyOrPattern.includes("*")) {
      await redis.del(keyOrPattern);
      return;
    }
    //pattern
    let cursor = "0";
    do {
      const result = await redis.scan(cursor, {
        MATCH: keyOrPattern,
        count: 100,
      });
      cursor = result.cursor;
      const keys = result.keys;
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } while (cursor !== "0");
  } catch (exception) {
    throw exception;
  }
};

module.exports = { getOrSetCache, invalidateCache };
