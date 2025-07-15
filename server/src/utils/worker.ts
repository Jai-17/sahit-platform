import { Queue, Worker } from "bullmq";
import redis from "./redis";

export const queue = new Queue("matchRequest", {
    connection: redis
})

const worker = new Worker('matchRequest', async job => {
    console.log("From Worker", job.data);
    const data = job.data;
}, {
    concurrency: 100, connection: redis
})