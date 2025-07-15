import Redis from "ioredis";
import { config } from "dotenv";
config();

const redis = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

export default redis;