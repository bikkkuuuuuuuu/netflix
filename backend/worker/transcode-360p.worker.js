require("dotenv").config();

const { Worker } = require("bullmq");

const { redis } = require("../src/config/redis.config.js");

const dbConnect = require("../src/config/db.config.js");

const { transcodeProfile } = require("../src/services/transcode.service.js");

async function startWorker() {
  await dbConnect();

  console.log("[360p Worker] MongoDB connected");

  const worker = new Worker(
    "movie-transcoding-360p",

    async (job) => {
      const { movieId } = job.data;

      console.log(`[360p Worker] Job ${job.id}`);

      await transcodeProfile(movieId, "360p");

      console.log(`[360p Worker] Completed ${movieId}`);
    },

    {
      connection: redis,
      concurrency: 1,
    },
  );

  worker.on("ready", () => {
    console.log("[360p Worker] Ready");
  });

  worker.on("completed", (job) => {
    console.log(`[360p Worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`[360p Worker] Job ${job?.id} failed: ${error.message}`);
  });

  worker.on("error", (error) => {
    console.error("[360p Worker] Error:", error);
  });

  const shutdown = async () => {
    await worker.close();

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);

  process.on("SIGINT", shutdown);
}

startWorker().catch((error) => {
  console.error("[360p Worker] Startup failed:", error);

  process.exit(1);
});
