require("dotenv").config();
const { Worker } = require("bullmq");
const { redis } = require("../src/config/redis.config.js");
const dbConnect = require("../src/config/db.config.js");
const { transcodeMovie } = require("../src/services/transcode.service.js");
const startWorker = async () => {
  try {
    console.log("[Worker] Starting...");
    await dbConnect();
    console.log("[Worker] MongoDB connection established");
    const worker = new Worker(
      "movie-transcoding",
      async (job) => {
        console.log(`[Worker] Processing movie: ${job.data.movieId}`);
        console.log(`[Worker] Job ID: ${job.id}`);
        await transcodeMovie(job.data.movieId);
        console.log(`[Worker] Finished movie: ${job.data.movieId}`);
      },
      {
        connection: redis,
        concurrency: 1,
      },
    );

    worker.on("ready", () => {
      console.log("[Worker] Ready and waiting for jobs...");
    });

    worker.on("active", (job) => {
      console.log(`[Worker] Job ${job.id} is now active`);
    });

    worker.on("completed", (job) => {
      console.log(`[Worker] Job ${job.id} completed`);
    });

    worker.on("failed", (job, error) => {
      console.error(`[Worker] Job ${job?.id} failed:`, error.message);
    });

    worker.on("error", (error) => {
      console.error("[Worker] Worker error:", error);
    });
  } catch (error) {
    console.error("[Worker] Failed to start:", error);
    process.exit(1);
  }
};

startWorker();
