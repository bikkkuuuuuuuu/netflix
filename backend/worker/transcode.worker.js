require("dotenv").config();
const { Worker } = require("bullmq");
const { redis } = require("../src/config/redis.config.js");
const dbConnect = require("../src/config/db.config.js");
const { transcodeProfile } = require("../src/services/transcode.service.js");

const PROFILE = process.env.TRANSCODE_PROFILE;
const validProfiles = ["1080p", "720p", "480p", "360p"];
if (!validProfiles.includes(PROFILE)) {
  console.error(`[Worker] Invalid TRANSCODE_PROFILE: ${PROFILE}`);
  process.exit(1);
}

const startWorker = async () => {
  try {
    console.log("[Worker] Starting...");
    await dbConnect();
    console.log("[Worker] MongoDB connection established");
    const worker = new Worker(
      "movie-transcoding",
      async (job) => {
        const { movieId, profile } = job.data;
        if (profile !== PROFILE) {
          throw new Error(`Worker ${PROFILE} received job for ${profile}`);
        }

        console.log(`[Worker] Processing movie: ${movieId}`);
        console.log(`[Worker] Job ID: ${job.id}`);
        await transcodeProfile(movieId, profile);
        console.log(`[Worker] Finished movie: ${movieId}`);
      },
      {
        connection: redis,
        concurrency: 1,
        limiter: {
          max: 1,
          duration: 1000,
        },
      },
    );

    worker.on("ready", () => {
      console.log("[Worker] Ready and waiting for jobs...");
    });

    worker.on("active", (job) => {
      console.log(`[Worker] ${PROFILE} Job ${job.id} active`);
    });

    worker.on("completed", (job) => {
      console.log(`[Worker] Job ${job.id} completed`);
    });

    worker.on("failed", (job, error) => {
      console.error(
        `[Worker] ${PROFILE} Job ${job?.id} failed:`,
        error.message,
      );
    });

    worker.on("error", (error) => {
      console.error(`[Worker] ${PROFILE} Worker error:`, error);
    });
    const shutdown = async () => {
      console.log(`[Worker:${PROFILE}] Shutting down...`);
      await worker.close();
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error(`[Worker]: ${PROFILE} Failed to start:`, error);
    process.exit(1);
  }
};

startWorker();
