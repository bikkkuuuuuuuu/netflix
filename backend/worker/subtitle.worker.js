require("dotenv").config();

const { Worker } = require("bullmq");

const { redis } = require("../src/config/redis.config.js");

const dbConnect = require("../src/config/db.config.js");

const { generateSubtitles } = require("../src/services/transcode.service.js");

async function startWorker() {
  await dbConnect();

  console.log("[Subtitle Worker] MongoDB connected");

  const worker = new Worker(
    "movie-subtitles",

    async (job) => {
      const { movieId } = job.data;

      console.log(`[Subtitle Worker] Job ${job.id}`);

      const subtitles = await generateSubtitles(movieId);

      console.log(
        `[Subtitle Worker] Generated ${subtitles.length} subtitle tracks`,
      );

      return subtitles;
    },

    {
      connection: redis,
      concurrency: 1,
    },
  );

  worker.on("ready", () => {
    console.log("[Subtitle Worker] Ready");
  });

  worker.on("completed", (job) => {
    console.log(`[Subtitle Worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`[Subtitle Worker] Job ${job?.id} failed: ${error.message}`);
  });

  worker.on("error", (error) => {
    console.error("[Subtitle Worker] Error:", error);
  });

  const shutdown = async () => {
    await worker.close();

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);

  process.on("SIGINT", shutdown);
}

startWorker().catch((error) => {
  console.error("[Subtitle Worker] Startup failed:", error);

  process.exit(1);
});
