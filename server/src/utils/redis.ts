import { Redis } from "@upstash/redis";
import { config } from "dotenv";
config();

const redis = new Redis({
    url: 'https://creative-mongoose-57903.upstash.io',
    token: process.env.REDIS_TOKEN
})

export default redis;