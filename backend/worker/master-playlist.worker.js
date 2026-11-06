require("dotenv").config();

const { Worker } = require("bullmq");
const fs = require("node:fs/promises");
const path = require("node:path");
const { redis } = require("../src/config/redis.config.js");
const dbConnect = require("../src/config/db.config.js");
const MovieModel = require("../src/modules/movies/movies.model.js");
const S3Storage = require("../src/services/storage/s3.storage.js");
const storage = new S3Storage();

const SUBTITLE_DIRECTORY = "subtitles";

const VIDEO_PROFILES = [
  {
    name: "1080p",
    bandwidth: 5192000,
    averageBandwidth: 5192000,
    resolution: "1920x1080",
    codecs: "avc1.640028",
  },
  {
    name: "720p",
    bandwidth: 3128000,
    averageBandwidth: 3128000,
    resolution: "1280x720",
    codecs: "avc1.64001f",
  },
  {
    name: "480p",
    bandwidth: 1628000,
    averageBandwidth: 1628000,
    resolution: "854x480",
    codecs: "avc1.64001f",
  },
  {
    name: "360p",
    bandwidth: 896000,
    averageBandwidth: 896000,
    resolution: "640x360",
    codecs: "avc1.640015",
  },
];

const AUDIO_DIRECTORY = "audio";
const AUDIO_MANIFEST = "tracks.json";

function getHlsDirectory(movieId) {
  return path.resolve(
    process.env.LOCAL_STORAGE_PATH || "./public",
    "movies",
    movieId.toString(),
    "hls",
  );
}
function getAudioManifestPath(movieId) {
  return path.join(getHlsDirectory(movieId), AUDIO_DIRECTORY, AUDIO_MANIFEST);
}
function escapeAttribute(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
    .replace(/,/g, " ");
}

async function ensureFileExists(filePath, description) {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`${description} is not a file: ${filePath}`);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`${description} does not exist: ${filePath}`);
    }
    throw error;
  }
  return filePath;
}
async function ensureProfileExists(movieId, profile) {
  const playlistPath = path.join(
    getHlsDirectory(movieId),
    profile,
    "index.m3u8",
  );

  return ensureFileExists(playlistPath, `${profile} video playlist`);
}

async function getAudioTracks(movieId) {
  const hlsDirectory = getHlsDirectory(movieId);
  const manifestPath = getAudioManifestPath(movieId);

  let rawManifest;

  try {
    rawManifest = await fs.readFile(manifestPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        `[Finalizer] No audio manifest for movie ${movieId}; checking video-only playback`,
      );

      return [];
    }

    throw error;
  }

  let tracks;

  try {
    tracks = JSON.parse(rawManifest);
  } catch {
    throw new Error(`Invalid audio manifest JSON: ${manifestPath}`);
  }

  if (!Array.isArray(tracks)) {
    throw new Error(`Audio manifest must contain an array: ${manifestPath}`);
  }

  const validatedTracks = [];

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];

    if (!track || typeof track !== "object") {
      throw new Error(`Invalid audio track at index ${i}`);
    }

    if (typeof track.playlist !== "string" || track.playlist.trim() === "") {
      throw new Error(`Audio track ${i} is missing its playlist path`);
    }

    // The manifest uses paths relative to the HLS directory.
    const relativePlaylist = track.playlist.replace(/\\/g, "/");

    // Prevent absolute paths and paths escaping the HLS directory.
    if (
      path.posix.isAbsolute(relativePlaylist) ||
      /^[a-zA-Z]:/.test(relativePlaylist)
    ) {
      throw new Error(
        `Audio playlist must be relative to the HLS directory: ${track.playlist}`,
      );
    }

    const playlistPath = path.resolve(
      hlsDirectory,
      ...relativePlaylist.split("/"),
    );

    const relativeToHls = path.relative(hlsDirectory, playlistPath);

    if (
      relativeToHls === ".." ||
      relativeToHls.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relativeToHls)
    ) {
      throw new Error(
        `Audio playlist escapes the HLS directory: ${track.playlist}`,
      );
    }

    await ensureFileExists(playlistPath, `Audio playlist ${i}`);

    const language =
      typeof track.language === "string" && track.language.trim() !== ""
        ? track.language.trim()
        : "und";

    const name =
      typeof track.name === "string" && track.name.trim() !== ""
        ? track.name.trim()
        : language !== "und"
          ? language.toUpperCase()
          : `Audio ${i + 1}`;

    validatedTracks.push({
      ...track,
      name,
      language,
      playlist: relativePlaylist,
      default: track.default === true,
    });
  }

  // Prefer a single default track.
  let defaultFound = false;

  return validatedTracks.map((track) => {
    const isDefault = track.default && !defaultFound;

    if (isDefault) {
      defaultFound = true;
    }

    return {
      ...track,
      default: isDefault,
    };
  });
}
async function createMasterPlaylist(movieId) {
  const hlsDirectory = getHlsDirectory(movieId);

  await fs.mkdir(hlsDirectory, {
    recursive: true,
  });

  // Verify all existing video profiles.
  for (const profile of VIDEO_PROFILES) {
    await ensureProfileExists(movieId, profile.name);
  }

  const audioTracks = await getAudioTracks(movieId);
  const subtitleTracks = await getSubtitleTracks(movieId);

  const lines = ["#EXTM3U", "#EXT-X-VERSION:4", ""];

  // Audio tracks.
  for (const track of audioTracks) {
    const channels =
      Number.isInteger(Number(track.channels)) && Number(track.channels) > 0
        ? `,CHANNELS="${Number(track.channels)}"`
        : "";

    lines.push(
      [
        "#EXT-X-MEDIA:TYPE=AUDIO",
        'GROUP-ID="audio"',
        `NAME="${escapeAttribute(track.name)}"`,
        `LANGUAGE="${escapeAttribute(track.language)}"`,
        `DEFAULT=${track.default ? "YES" : "NO"}`,
        `AUTOSELECT=${track.default ? "YES" : "NO"}`,
        `URI="${encodeRelativeUri(track.playlist)}"${channels}`,
      ].join(","),
    );

    lines.push("");
  }

  // Subtitle tracks.
  for (let index = 0; index < subtitleTracks.length; index++) {
    const track = subtitleTracks[index];

    lines.push(
      [
        "#EXT-X-MEDIA:TYPE=SUBTITLES",
        'GROUP-ID="subs"',
        `NAME="${escapeAttribute(track.name)}"`,
        `LANGUAGE="${escapeAttribute(track.language)}"`,
        "DEFAULT=NO",
        "AUTOSELECT=YES",
        `URI="${encodeRelativeUri(track.playlist)}"`,
      ].join(","),
    );

    lines.push("");
  }

  // Video variants.
  for (const profile of VIDEO_PROFILES) {
    const attributes = [
      `BANDWIDTH=${profile.bandwidth}`,
      `AVERAGE-BANDWIDTH=${profile.averageBandwidth}`,
      `RESOLUTION=${profile.resolution}`,
      `CODECS="${profile.codecs}${audioTracks.length > 0 ? ",mp4a.40.2" : ""}"`,
    ];

    if (audioTracks.length > 0) {
      attributes.push('AUDIO="audio"');
    }

    if (subtitleTracks.length > 0) {
      attributes.push('SUBTITLES="subs"');
    }

    lines.push(`#EXT-X-STREAM-INF:${attributes.join(",")}`);
    lines.push(`${profile.name}/index.m3u8`);
    lines.push("");
  }

  const content = `${lines.join("\n").trimEnd()}\n`;
  const masterPath = path.join(hlsDirectory, "master.m3u8");
  const temporaryPath = `${masterPath}.tmp`;

  await fs.writeFile(temporaryPath, content, "utf8");
  await fs.rename(temporaryPath, masterPath);

  console.log(
    `[Finalizer] Master playlist created with ` +
      `${VIDEO_PROFILES.length} video profiles, ` +
      `${audioTracks.length} audio tracks, and ` +
      `${subtitleTracks.length} subtitle tracks`,
  );

  return masterPath;
}

async function startWorker() {
  await dbConnect();

  console.log("[Finalizer] MongoDB connected");

  const worker = new Worker(
    "movie-transcoding-finalizer",

    // async (job) => {
    //   const { movieId } = job.data;

    //   console.log(`[Finalizer] Processing movie ${movieId}`);

    //   /*
    //    * If this worker runs, BullMQ has
    //    * successfully completed all child
    //    * jobs.
    //    */
    //   const masterPath = await createMasterPlaylist(movieId);

    //   console.log(`[Finalizer] Master playlist created: ${masterPath}`);

    //   const movie = await MovieModel.findById(movieId);

    //   if (!movie) {
    //     throw new Error(`Movie ${movieId} not found`);
    //   }
    //   movie.video.hlsUrl = `/movies/${movieId}/hls/master.m3u8`;
    //   movie.processing.status = "ready";
    //   movie.processing.progress = 100;
    //   movie.processing.error = null;
    //   await movie.save();
    //   console.log(`[Finalizer] Movie ${movieId} is READY`);
    //   return {
    //     movieId,
    //     masterPlaylist: `/movies/${movieId}/hls/master.m3u8`,
    //     masterPath,
    //   };
    // },

    async (job) => {
      const { movieId } = job.data;

      console.log(`[Finalizer] Processing movie ${movieId}`);

      const movie = await MovieModel.findById(movieId);

      if (!movie) {
        throw new Error(`Movie ${movieId} not found`);
      }

      // 1. Generate master playlist locally.
      const masterPath = await createMasterPlaylist(movieId);

      console.log(`[Finalizer] Master playlist created: ${masterPath}`);

      // 2. Upload the COMPLETE HLS directory to S3.
      const hlsDirectory = getHlsDirectory(movieId);
      const s3Prefix = `movies/${movieId}/hls`;

      console.log(`[Finalizer] Uploading HLS files to S3: ${s3Prefix}`);

      const uploadedFiles = await storage.uploadDirectory(
        hlsDirectory,
        s3Prefix,
      );

      // 3. Verify that the master playlist was uploaded.
      const masterKey = `${s3Prefix}/master.m3u8`;

      const masterUploaded = uploadedFiles.some(
        (file) => file.key === masterKey,
      );

      if (!masterUploaded) {
        throw new Error(`Master playlist was not uploaded to S3: ${masterKey}`);
      }

      console.log(
        `[Finalizer] Successfully uploaded ${uploadedFiles.length} HLS files`,
      );

      // 4. Generate the permanent S3 playback URL.
      const hlsUrl = storage.getPublicUrl(masterKey);

      console.log(`[Finalizer] Playback URL: ${hlsUrl}`);

      // 5. Update MongoDB only after successful upload.
      movie.video.hlsUrl = hlsUrl;

      movie.processing.status = "ready";
      movie.processing.progress = 100;
      movie.processing.error = null;

      await movie.save();

      console.log(`[Finalizer] Movie ${movieId} is READY`);

      // 6. Remove local temporary files after successful upload.
      try {
        await storage.removeLocalMovie(movieId);
        console.log(`[Finalizer] Local files cleaned for ${movieId}`);
      } catch (cleanupError) {
        console.error(
          `[Finalizer] Local cleanup failed for ${movieId}:`,
          cleanupError,
        );
      }

      console.log(`[Finalizer] Local files cleaned for ${movieId}`);

      return {
        movieId,
        masterPlaylist: hlsUrl,
        masterKey,
        uploadedFiles: uploadedFiles.length,
      };
    },

    {
      connection: redis,
      concurrency: 1,
    },
  );

  worker.on("ready", () => {
    console.log("[Finalizer] Ready");
  });

  worker.on("completed", (job) => {
    console.log(`[Finalizer] Job ${job.id} completed`);
  });

  worker.on("failed", async (job, error) => {
    console.error(`[Finalizer] Job ${job?.id} failed: ${error.message}`);

    const movieId = job?.data?.movieId;

    if (!movieId) {
      return;
    }

    try {
      await MovieModel.findByIdAndUpdate(movieId, {
        $set: {
          "processing.status": "failed",

          "processing.error": error.message,
        },
      });
    } catch (updateError) {
      console.error("[Finalizer] Failed to update movie:", updateError);
    }
  });

  worker.on("error", (error) => {
    console.error("[Finalizer] Worker error:", error);
  });

  const shutdown = async () => {
    console.log("[Finalizer] Shutting down...");

    await worker.close();

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);

  process.on("SIGINT", shutdown);
}

startWorker().catch((error) => {
  console.error("[Finalizer] Startup failed:", error);

  process.exit(1);
});

function getSubtitleLanguage(filename) {
  const baseName = path.basename(filename, path.extname(filename));

  // Recognize filenames such as eng.vtt, eng-1.vtt, hin_subtitle.vtt.
  const match = baseName.match(/^([a-z]{2,3})(?:[-_].*)?$/i);

  return match ? match[1].toLowerCase() : "und";
}

function getSubtitleName(filename, language) {
  if (language !== "und") {
    return language.toUpperCase();
  }

  return path.basename(filename, path.extname(filename));
}

function encodeRelativeUri(relativePath) {
  return relativePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

async function getSubtitleTracks(movieId) {
  const hlsDirectory = getHlsDirectory(movieId);
  const subtitleDirectory = path.join(hlsDirectory, SUBTITLE_DIRECTORY);

  let files;

  try {
    files = await fs.readdir(subtitleDirectory);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`[Finalizer] No subtitle directory for movie ${movieId}`);

      return [];
    }

    throw error;
  }

  const regularFiles = [];

  for (const filename of files) {
    const filePath = path.join(subtitleDirectory, filename);
    const stats = await fs.stat(filePath);

    if (stats.isFile()) {
      regularFiles.push(filename);
    }
  }

  const playlistFiles = regularFiles.filter((file) =>
    file.toLowerCase().endsWith(".m3u8"),
  );

  const vttFiles = regularFiles.filter((file) =>
    file.toLowerCase().endsWith(".vtt"),
  );

  const tracks = [];

  // Prefer existing HLS subtitle playlists.
  for (const filename of playlistFiles) {
    const playlistPath = path.join(subtitleDirectory, filename);
    const playlistContent = await fs.readFile(playlistPath, "utf8");

    if (!playlistContent.includes("#EXTM3U")) {
      throw new Error(`Invalid subtitle playlist: ${playlistPath}`);
    }

    const language = getSubtitleLanguage(filename);

    tracks.push({
      name: getSubtitleName(filename, language),
      language,
      playlist: `${SUBTITLE_DIRECTORY}/${filename}`,
    });
  }

  // Wrap standalone VTT files in HLS subtitle playlists.
  for (const filename of vttFiles) {
    const baseName = path.basename(filename, path.extname(filename));

    // Avoid creating another playlist if one already exists for this VTT.
    const hasPlaylist = playlistFiles.some(
      (playlist) =>
        path.basename(playlist, path.extname(playlist)) === baseName,
    );

    if (hasPlaylist) {
      continue;
    }

    const vttPath = path.join(subtitleDirectory, filename);
    const vttContent = await fs.readFile(vttPath, "utf8");

    if (!vttContent.trimStart().startsWith("WEBVTT")) {
      throw new Error(`Invalid WebVTT subtitle file: ${vttPath}`);
    }

    const cueEndMatches = [
      ...vttContent.matchAll(/-->\s*(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})/g),
    ];

    const cueEndSeconds = cueEndMatches.map((match) => {
      const hours = Number(match[1] || 0);
      const minutes = Number(match[2]);
      const seconds = Number(match[3]);
      const milliseconds = Number(match[4]);

      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    });

    if (cueEndSeconds.length === 0) {
      console.warn(
        `[Finalizer] No subtitle cues found in ${filename}; skipping`,
      );

      continue;
    }

    const duration = Math.max(1, Math.ceil(Math.max(...cueEndSeconds)));

    const playlistFilename = `${baseName}.m3u8`;
    const playlistPath = path.join(subtitleDirectory, playlistFilename);

    const playlistContent = [
      "#EXTM3U",
      "#EXT-X-VERSION:3",
      `#EXT-X-TARGETDURATION:${duration}`,
      "#EXT-X-MEDIA-SEQUENCE:0",
      `#EXTINF:${duration}.000,`,
      filename,
      "#EXT-X-ENDLIST",
      "",
    ].join("\n");

    await fs.writeFile(playlistPath, playlistContent, "utf8");

    const language = getSubtitleLanguage(filename);

    tracks.push({
      name: getSubtitleName(filename, language),
      language,
      playlist: `${SUBTITLE_DIRECTORY}/${playlistFilename}`,
    });

    console.log(`[Finalizer] Created subtitle playlist for ${filename}`);
  }

  console.log(
    `[Finalizer] Found ${tracks.length} subtitle tracks for movie ${movieId}`,
  );

  return tracks;
}
