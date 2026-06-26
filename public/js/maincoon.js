const MAINCOON_FOLDER = "maincoon";

let manifestPromise = null;

function getBaseUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch("/data/maincoon-images.json")
      .then((res) => res.json())
      .catch(() => ({
        folder: MAINCOON_FOLDER,
        count: 0,
        images: [],
      }));
  }
  return manifestPromise;
}

function buildImageUrl(path, baseUrl = getBaseUrl()) {
  return `${baseUrl}${path}`;
}

function pickRandom(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

async function getRandomImage(baseUrl = getBaseUrl()) {
  const manifest = await loadManifest();
  const image = pickRandom(manifest.images);
  if (!image) return null;

  return {
    filename: image.filename,
    path: image.path,
    url: buildImageUrl(image.path, baseUrl),
    folder: manifest.folder,
  };
}

async function getRandomImages(count, baseUrl = getBaseUrl()) {
  const manifest = await loadManifest();
  const pool = [...manifest.images];

  const selected = [];
  while (selected.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    const [image] = pool.splice(index, 1);
    selected.push({
      filename: image.filename,
      path: image.path,
      url: buildImageUrl(image.path, baseUrl),
      folder: manifest.folder,
    });
  }

  return selected;
}

async function getAllImageUrls(baseUrl = getBaseUrl()) {
  const manifest = await loadManifest();
  return manifest.images.map((image) => ({
    filename: image.filename,
    path: image.path,
    url: buildImageUrl(image.path, baseUrl),
    folder: manifest.folder,
  }));
}

window.MaincoonImages = {
  MAINCOON_FOLDER,
  loadManifest,
  getRandomImage,
  getRandomImages,
  getAllImageUrls,
  buildImageUrl,
};
