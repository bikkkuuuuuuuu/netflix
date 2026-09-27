const { redis } = require("../config/redis.config");
const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local refillInterval = tonumber(ARGV[3])
local tokensRequired = tonumber(ARGV[4])
local now = tonumber(ARGV[5])

-- Get current bucket state
local bucket = redis.call(
  'HMGET',
  key,
  'tokens',
  'last_refill'
)

local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

-- Create bucket if it doesn't exist
if tokens == nil then
  tokens = capacity
  lastRefill = now
end

-- Calculate elapsed time
local timePassed = now - lastRefill

-- Calculate how many tokens to add
local tokensToAdd = math.floor(
  (timePassed / refillInterval) * refillRate
)

-- Refill bucket
if tokensToAdd > 0 then
  tokens = math.min(
    capacity,
    tokens + tokensToAdd
  )

  lastRefill = now
end

local allowed = 0

-- Check if request can consume tokens
if tokens >= tokensRequired then
  tokens = tokens - tokensRequired
  allowed = 1
end

-- Save bucket
redis.call(
  'HSET',
  key,
  'tokens',
  tokens,
  'last_refill',
  lastRefill
)

-- Automatically delete inactive buckets
redis.call(
  'EXPIRE',
  key,
  3600
)

return {
  allowed,
  tokens
}
`;
class RateLimiterService {
  static async consume({
    key,
    capacity = 100,
    refillRate = 10,
    refillInterval = 1000,
    tokensRequired = 1,
  }) {
    const now = Date.now();

    const result = await redis.eval(TOKEN_BUCKET_SCRIPT, {
      keys: [key],
      arguments: [
        capacity.toString(),
        refillRate.toString(),
        refillInterval.toString(),
        tokensRequired.toString(),
        now.toString(),
      ],
    });

    return {
      allowed: Number(result[0]) === 1,
      remaining: Number(result[1]),
    };
  }
}

module.exports = RateLimiterService;
