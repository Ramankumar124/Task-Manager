import Redis, { RedisOptions } from "ioredis";

let redisClient: Redis;
const upstashRedisOptions: RedisOptions = {
  tls: {},
  maxRetriesPerRequest: null,
};
redisClient = new Redis(process.env.UPSTASH_REDIS_URL!, upstashRedisOptions);
redisClient.on("connect", () => {
  console.log(`Successfully connected to Redis`);
});

redisClient.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});

export default redisClient;
