const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redis.on("connect", () => {
  console.log("Redis connecting...");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};

module.exports = {
  redis,
  connectRedis,
};
