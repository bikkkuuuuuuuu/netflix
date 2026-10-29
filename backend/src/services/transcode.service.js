const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const MovieModel = require("../modules/movies/movies.model.js");

const profiles = {
  "1080p": {
    name: "1080p",
    width: 1920,
    height: 1080,
    videoBitrate: "5000k",
    audioBitrate: "192k",
  },

  "720p": {
    name: "720p",
    width: 1280,
    height: 720,
    videoBitrate: "3000k",
    audioBitrate: "128k",
  },

  "480p": {
    name: "480p",
    width: 854,
    height: 480,
    videoBitrate: "1500k",
    audioBitrate: "128k",
  },

  "360p": {
    name: "360p",
    width: 640,
    height: 360,
    videoBitrate: "800k",
    audioBitrate: "96k",
  },
};
function getMovieRoot(movieId) {
  return path.join(getStorageRoot(), "movies", movieId.toString());
}
function getStorageRoot() {
  return path.resolve(process.env.LOCAL_STORAGE_PATH || "./public");
}
function getSourcePath(movie) {
  return path.resolve(getStorageRoot(), movie.video.sourceKey);
}

function getHlsDirectory(movieId) {
  return path.join(getMovieRoot(movieId), "hls");
}

function getProfileDirectory(movieId, profileName) {
  return path.join(getHlsDirectory(movieId), profileName);
}

function runFFmpeg(input, outputDirectory, profile) {
  return new Promise((resolve, reject) => {
    const profileDirectory = path.join(outputDirectory, profile.name);
    const output = path.join(profileDirectory, "index.m3u8");

    const segmentPattern = path.join(profileDirectory, "segment_%05d.ts");
    const args = [
      "-y",
      "-i",
      input,
      "-map",
      "0:v:0",
      "-map",
      "0:a:0?",
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
      segmentPattern,
      output,
    ];

    const ffmpeg = spawn("ffmpeg", args);
    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      const progressMatch = text.match(/time=(\S+)/);
      if (progressMatch) {
        console.log(`[FFmpeg:${profile.name}] ${progressMatch[1]}`);
      }
    });
    ffmpeg.on("error", (error) => {
      reject(error);
    });
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
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

async function transcodeProfile(movieId, profileName) {
  const profile = profiles[profileName];
  if (!profile) {
    throw new Error(`Unknown transcoding profile: ${profileName}`);
  }
  const movie = await MovieModel.findById(movieId);

  if (!movie) {
    throw new Error(`Movie ${movieId} not found`);
  }
  const sourcePath = getSourcePath(movie);
  const hlsDirectory = getHlsDirectory(movieId);
  const profileDirectory = getProfileDirectory(movieId, profileName);
  await fs.mkdir(profileDirectory, {
    recursive: true,
  });
  try {
    await fs.access(sourcePath);
  } catch {
    throw new Error(`Source video does not exist: ${sourcePath}`);
  }

  await runFFmpeg(sourcePath, hlsDirectory, profile);

  return {
    movieId,
    profile: profileName,
    playlist: `/movies/${movieId}/hls/${profileName}/index.m3u8`,
  };
  // movie.processing.status = "processing";
  // movie.processing.progress = 0;
  // await movie.save();
  // try {
  //   for (let i = 0; i < profiles.length; i++) {
  //     const profile = profiles[i];

  //     const profileDirectory = path.join(outputDirectory, profile.name);

  //     await fs.mkdir(profileDirectory, {
  //       recursive: true,
  //     });

  //     await runFFmpeg(sourcePath, outputDirectory, profile);

  //     movie.processing.progress = Math.round(((i + 1) / profiles.length) * 90);

  //     await movie.save();
  //   }

  //   await createMasterPlaylist(outputDirectory);

  //   movie.video.hlsUrl = `/media/movies/${movieId}/master.m3u8`;

  //   movie.processing.progress = 100;

  //   movie.processing.status = "ready";

  //   await movie.save();
  // } catch (error) {
  //   movie.processing.status = "failed";

  //   movie.processing.error = error.message;

  //   await movie.save();

  //   throw error;
  // }
}

async function generateSubtitles(movieId) {
  const movie = await MovieModel.findById(movieId);
  if (!movie) {
    throw new Error(`Movie ${movieId} not found`);
  }
  const sourcePath = getSourcePath(movie);
  const subtitleDirectory = path.join(getHlsDirectory(movieId), "subtitles");

  await fs.mkdir(subtitleDirectory, {
    recursive: true,
  });
  const streams = await probeSubtitleStreams(sourcePath);
  if (streams.length === 0) {
    console.log(`[Subtitles] No subtitle streams found for ${movieId}`);
    return [];
  }
  const generated = [];
  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i];
    const language = stream.tags?.language || `track-${i + 1}`;
    const title = stream.tags?.title;
    const fileName = `${language}-${i + 1}.vtt`;
    const output = path.join(subtitleDirectory, fileName);
    await extractSubtitle(sourcePath, stream.index, output);

    generated.push({
      index: i,
      streamIndex: stream.index,
      language,
      title,
      path: output,
      url: `/movies/${movieId}/hls/subtitles/${fileName}`,
    });
  }
  return generated;
}

function probeSubtitleStreams(input) {
  return new Promise((resolve, reject) => {
    const args = [
      "-v",
      "error",
      "-select_streams",
      "s",
      "-show_entries",
      "stream=index,codec_name:stream_tags=language,title",
      "-of",
      "json",
      input,
    ];

    const ffprobe = spawn("ffprobe", args);

    let stdout = "";
    let stderr = "";

    ffprobe.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    ffprobe.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    ffprobe.on("error", reject);
    ffprobe.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe failed: ${stderr}`));
        return;
      }
      try {
        const data = JSON.parse(stdout);
        resolve(data.streams || []);
      } catch (error) {
        reject(error);
      }
    });
  });
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

function extractSubtitle(input, streamIndex, output) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i",
      input,
      "-map",
      `0:${streamIndex}`,
      "-c:s",
      "webvtt",
      output,
    ];
    console.log(`[Subtitles] Extracting stream ${streamIndex}`);
    const ffmpeg = spawn("ffmpeg", args);
    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Subtitle extraction failed: ${stderr.slice(-3000)}`));
    });
  });
}
module.exports = {
  profiles,
  transcodeProfile,
  generateSubtitles,
};
