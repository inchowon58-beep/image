const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const configDir = path.join(root, "config");
const dataDir = path.join(root, "public", "data");

fs.mkdirSync(dataDir, { recursive: true });

const configFiles = fs
  .readdirSync(configDir)
  .filter((name) => name.endsWith(".json"))
  .sort();

const foldersIndex = [];

for (const configFile of configFiles) {
  const config = JSON.parse(
    fs.readFileSync(path.join(configDir, configFile), "utf8")
  );

  const imageDir = path.join(root, "public", config.folder);
  if (!fs.existsSync(imageDir)) {
    console.warn(`Skipping ${config.folder}: folder not found.`);
    continue;
  }

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

  const outputName = `${config.folder}-images.json`;
  fs.writeFileSync(
    path.join(dataDir, outputName),
    JSON.stringify(manifest, null, 2)
  );

  foldersIndex.push({
    folder: config.folder,
    format: config.format,
    count: images.length,
    sample: images[0]?.path || null,
  });

  console.log(`Generated ${outputName} with ${images.length} images.`);
}

fs.writeFileSync(
  path.join(dataDir, "folders-index.json"),
  JSON.stringify({ folders: foldersIndex }, null, 2)
);

console.log(`Generated folders-index.json with ${foldersIndex.length} folders.`);
