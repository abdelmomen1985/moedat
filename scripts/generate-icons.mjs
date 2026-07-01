import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(ROOT, '../design/icon-source.svg');
const ICONS_DIR = path.join(ROOT, '../public/icons');
const PUBLIC_DIR = path.join(ROOT, '../public');

const MANIFEST_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

mkdirSync(ICONS_DIR, { recursive: true });

async function run() {
  for (const size of MANIFEST_SIZES) {
    await sharp(SOURCE).resize(size, size).png().toFile(
      path.join(ICONS_DIR, `icon-${size}x${size}.png`)
    );
    console.log(`generated icon-${size}x${size}.png`);
  }

  await sharp(SOURCE).resize(180, 180).png().toFile(
    path.join(PUBLIC_DIR, 'apple-touch-icon.png')
  );
  console.log('generated apple-touch-icon.png');

  await sharp(SOURCE).resize(32, 32).png().toFile(
    path.join(PUBLIC_DIR, 'favicon.png')
  );
  console.log('generated favicon.png');
}

run();
