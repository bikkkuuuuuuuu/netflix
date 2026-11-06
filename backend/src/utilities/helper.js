const randomStringGenerator = (len = 10, str = true) => {
  let characters = "0123456789";
  if (str) {
    characters +=
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  }
  let length = characters.length;
  let random = "";
  for (let i = 1; i <= len; i++) {
    let position = Math.ceil(Math.random() * length - 1);
    random += characters[position];
  }
  return random;
};

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const calculateMatch = (candidateValues = [], preferredValues = []) => {
  if (!candidateValues.length || !preferredValues.length) return 0;

  const candidateSet = new Set(candidateValues.map(normalize));

  let matches = 0;
  let totalWeight = 0;

  preferredValues.forEach(({ value, weight }) => {
    totalWeight += weight;

    if (candidateSet.has(normalize(value))) {
      matches += weight;
    }
  });

  return totalWeight ? (matches / totalWeight) * 100 : 0;
};

const buildPreferences = (history) => {
  const preferences = {
    genres: [],
    cast: [],
    directors: [],
    years: [],
  };

  history.forEach((item, index) => {
    const movie = item.movie;
    if (!movie) return;

    // Recent watches have more influence.
    const weight = Math.max(0.25, 1 - index * 0.025);

    movie.genres?.forEach((genre) => {
      preferences.genres.push({ value: genre, weight });
    });

    movie.cast?.forEach((person) => {
      if (person.name) {
        preferences.cast.push({ value: person.name, weight });
      }
    });

    movie.directors?.forEach((director) => {
      preferences.directors.push({ value: director, weight });
    });

    if (movie.releaseYear) {
      preferences.years.push({
        value: movie.releaseYear,
        weight,
      });
    }
  });

  return preferences;
};

module.exports = {
  randomStringGenerator,
  calculateMatch,
  buildPreferences,
};
