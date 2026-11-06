require("dotenv").config();

const { Queue } = require("bullmq");

const { redis } = require("../src/config/redis.config.js");

const FINALIZER_QUEUE = "movie-transcoding-finalizer";

async function main() {
  const movieId = process.argv[2];

  if (!movieId) {
    throw new Error("Usage: node scripts/finalize-existing-movie.js <movieId>");
  }

  const queue = new Queue(FINALIZER_QUEUE, {
    connection: redis,
  });

  try {
    const job = await queue.add(
      `finalize-existing-${movieId}-${Date.now()}`,
      { movieId },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );

    console.log(
      `[Audio Repair] Queued master playlist regeneration: job=${job.id}, movie=${movieId}`,
    );
  } finally {
    await queue.close();
  }
}

main().catch((error) => {
  console.error("[Audio Repair] Failed:", error);
  process.exitCode = 1;
});
