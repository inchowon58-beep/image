const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const config = JSON.parse(
  fs.readFileSync(path.join(root, "config", "maincoon.json"), "utf8")
);

const imageDir = path.join(root, "public", config.folder);
const files = fs
  .readdirSync(imageDir)
  .filter((name) => name.endsWith(`.${config.format}`))
  .sort();

const images = files.map((filename) => ({
  filename,
  path: `/${config.folder}/${filename}`,
}));

const manifest = {
  folder: config.folder,
  format: config.format,
  count: images.length,
  images,
};

const dataDir = path.join(root, "public", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(
  path.join(dataDir, "maincoon-images.json"),
  JSON.stringify(manifest, null, 2)
);

console.log(`Generated manifest with ${images.length} images.`);
