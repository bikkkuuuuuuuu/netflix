require("dotenv").config();

const { Queue } = require("bullmq");
const { redis } = require("../src/config/redis.config.js");

const QUEUE_NAME = "movie-transcoding-finalizer";

const FAILED_JOB_IDS = ["20", "21"];

async function retryFinalizerJobs() {
  const queue = new Queue(QUEUE_NAME, {
    connection: redis,
  });

  try {
    console.log("\n[Retry] Checking finalizer queue...\n");

    for (const jobId of FAILED_JOB_IDS) {
      const job = await queue.getJob(jobId);

      if (!job) {
        console.log(`[Retry] Job ${jobId} not found. Skipping.`);
        continue;
      }

      const state = await job.getState();

      console.log(
        `[Retry] Job ${jobId} | Movie ${job.data.movieId} | State: ${state}`,
      );

      if (state !== "failed") {
        console.log(`[Retry] Job ${jobId} is not failed. Skipping.`);
        continue;
      }

      await job.retry("failed");

      console.log(`[Retry] Successfully requeued job ${jobId}`);
    }

    console.log("\n[Retry] Finalizer retry operation completed.");
  } catch (error) {
    console.error("[Retry] Failed:", error);
    process.exitCode = 1;
  } finally {
    await queue.close();
    await redis.quit();
  }
}

retryFinalizerJobs();
