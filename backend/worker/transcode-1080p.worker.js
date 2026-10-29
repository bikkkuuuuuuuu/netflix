require("dotenv").config();

const { Worker } = require("bullmq");

const { redis } = require("../src/config/redis.config.js");

const dbConnect = require("../src/config/db.config.js");

const { transcodeProfile } = require("../src/services/transcode.service.js");

const QUEUE = "movie-transcoding-1080p";

async function startWorker() {
  await dbConnect();

  console.log("[1080p Worker] MongoDB connected");

  const worker = new Worker(
    QUEUE,

    async (job) => {
      const { movieId } = job.data;

      console.log(`[1080p Worker] Job ${job.id}`);

      await transcodeProfile(movieId, "1080p");

      console.log(`[1080p Worker] Completed ${movieId}`);
    },

    {
      connection: redis,
      concurrency: 1,
    },
  );

  worker.on("ready", () => {
    console.log("[1080p Worker] Ready");
  });

  worker.on("completed", (job) => {
    console.log(`[1080p Worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`[1080p Worker] Job ${job?.id} failed: ${error.message}`);
  });

  worker.on("error", (error) => {
    console.error("[1080p Worker] Error:", error);
  });

  const shutdown = async () => {
    console.log("[1080p Worker] Shutting down...");

    await worker.close();

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);

  process.on("SIGINT", shutdown);
}

startWorker().catch((error) => {
  console.error("[1080p Worker] Startup failed:", error);

  process.exit(1);
});
