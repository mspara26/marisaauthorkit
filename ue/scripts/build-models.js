import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const baseDir = dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = join(baseDir, '..', 'models', 'blocks');
const ROOT_DIR = join(baseDir, '..', '..');

async function build() {
  const allDefinitions = [];
  const allModels = [];
  const allFilters = [];

  const files = (await readdir(MODELS_DIR)).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const content = JSON.parse(await readFile(join(MODELS_DIR, file), 'utf-8'));

    if (content.definitions) allDefinitions.push(...content.definitions);
    if (content.models) allModels.push(...content.models);
    if (content.filters) allFilters.push(...content.filters);
  }

  await Promise.all([
    writeFile(
      join(ROOT_DIR, 'component-definition.json'),
      JSON.stringify({ groups: [{ title: 'Blocks', id: 'blocks', components: allDefinitions }] }, null, 2),
    ),
    writeFile(
      join(ROOT_DIR, 'component-models.json'),
      JSON.stringify(allModels, null, 2),
    ),
    writeFile(
      join(ROOT_DIR, 'component-filters.json'),
      JSON.stringify(allFilters, null, 2),
    ),
  ]);

  console.log(`Built UE models from ${files.length} block files:`);
  console.log(`  - ${allDefinitions.length} definitions`);
  console.log(`  - ${allModels.length} models`);
  console.log(`  - ${allFilters.length} filters`);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
