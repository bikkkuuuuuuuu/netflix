const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");

const Movie = require("../modules/movies/movies.model.js");
const storage = require("./storage/storage.factory.js");

const profiles = [
  {
    name: "1080p",
    width: 1920,
    height: 1080,
    videoBitrate: "5000k",
    audioBitrate: "192k",
  },

  {
    name: "720p",
    width: 1280,
    height: 720,
    videoBitrate: "3000k",
    audioBitrate: "128k",
  },

  {
    name: "480p",
    width: 854,
    height: 480,
    videoBitrate: "1500k",
    audioBitrate: "128k",
  },

  {
    name: "360p",
    width: 640,
    height: 360,
    videoBitrate: "800k",
    audioBitrate: "96k",
  },
];

function runFFmpeg(input, outputDirectory, profile) {
  return new Promise((resolve, reject) => {
    const output = path.join(outputDirectory, profile.name, "index.m3u8");
    const args = [
      "-i",
      input,

      "-vf",
      `scale=w=${profile.width}:h=${profile.height}:force_original_aspect_ratio=decrease,pad=${profile.width}:${profile.height}:(ow-iw)/2:(oh-ih)/2`,

      "-c:v",
      "libx264",

      "-preset",
      "medium",

      "-b:v",
      profile.videoBitrate,

      "-maxrate",
      profile.videoBitrate,

      "-bufsize",
      "2M",

      "-c:a",
      "aac",

      "-b:a",
      profile.audioBitrate,

      "-ac",
      "2",

      "-f",
      "hls",

      "-hls_time",
      "6",

      "-hls_playlist_type",
      "vod",

      "-hls_segment_filename",
      path.join(outputDirectory, profile.name, "segment_%05d.ts"),

      output,
    ];
    const ffmpeg = spawn("ffmpeg", args);
    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `FFmpeg failed for ${profile.name}: ${stderr.slice(-3000)}`,
          ),
        );
      }
    });
  });
}

async function transcodeMovie(movieId) {
  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new Error(`Movie ${movieId} not found`);
  }

  movie.processing.status = "processing";
  movie.processing.progress = 0;
  await movie.save();
  try {
    const sourcePath = path.resolve(
      process.env.LOCAL_STORAGE_PATH || "./public",
      movie.video.sourceKey,
    );

    const outputDirectory = path.resolve(
      process.env.LOCAL_STORAGE_PATH || "./public",
      "movies",
      movieId.toString(),
    );
    await fs.mkdir(outputDirectory, {
      recursive: true,
    });
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];

      const profileDirectory = path.join(outputDirectory, profile.name);

      await fs.mkdir(profileDirectory, {
        recursive: true,
      });

      await runFFmpeg(sourcePath, outputDirectory, profile);

      movie.processing.progress = Math.round(((i + 1) / profiles.length) * 90);

      await movie.save();
    }

    await createMasterPlaylist(outputDirectory);

    movie.video.hlsUrl = `/media/movies/${movieId}/master.m3u8`;

    movie.processing.progress = 100;

    movie.processing.status = "ready";

    await movie.save();
  } catch (error) {
    movie.processing.status = "failed";

    movie.processing.error = error.message;

    await movie.save();

    throw error;
  }
}

async function createMasterPlaylist(outputDirectory) {
  const content = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=5192000,RESOLUTION=1920x1080
1080p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=3128000,RESOLUTION=1280x720
720p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1628000,RESOLUTION=854x480
480p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=896000,RESOLUTION=640x360
360p/index.m3u8
`;

  await fs.writeFile(path.join(outputDirectory, "master.m3u8"), content);
}
module.exports = { transcodeMovie };
