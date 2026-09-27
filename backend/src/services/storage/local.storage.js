const fs = require("node:fs/promises");
const path = require("node:path");

const root = path.resolve(process.env.LOCAL_STORAGE_PATH || "./public");

class LocalStorage {
  async ensureDirectory(directory) {
    await fs.mkdir(directory, {
      recursive: true,
    });
  }

  getMovieDirectory(movieId) {
    return path.join(root, "movies", movieId.toString());
  }

  getUploadPath(filename) {
    return path.join(root, "uploads", filename);
  }
  getSourceDirectory(movieId) {
    return path.join(this.getMovieDirectory(movieId), "source");
  }
  getHlsDirectory(movieId) {
    return path.join(this.getMovieDirectory(movieId), "hls");
  }

  async createMovieDirectories(movieId) {
    const sourceDirectory = this.getSourceDirectory(movieId);

    const hlsDirectory = this.getHlsDirectory(movieId);

    await this.ensureDirectory(sourceDirectory);
    await this.ensureDirectory(hlsDirectory);

    return {
      sourceDirectory,
      hlsDirectory,
    };
  }

  async moveSourceVideo(movieId, file) {
    const sourceDirectory = this.getSourceDirectory(movieId);

    await this.ensureDirectory(sourceDirectory);

    const extension = path.extname(file.originalname) || ".mp4";

    const filename = `source${extension}`;

    const destination = path.join(sourceDirectory, filename);

    await fs.rename(file.path, destination);

    return {
      key: `movies/${movieId}/source/${filename}`,
      path: destination,
    };
  }

  async saveUpload(file) {
    const directory = path.join(root, "uploads");

    await this.ensureDirectory(directory);

    const destination = this.getUploadPath(file.filename);

    await fs.rename(file.path, destination);

    return {
      key: `uploads/${file.filename}`,
      path: destination,
    };
  }

  async remove(key) {
    const filePath = path.join(root, key);

    await fs.rm(filePath, {
      recursive: true,
      force: true,
    });
  }

  getPublicUrl(key) {
    return `${process.env.PUBLIC_MEDIA_URL}/${key}`;
  }
}

module.exports = LocalStorage;
