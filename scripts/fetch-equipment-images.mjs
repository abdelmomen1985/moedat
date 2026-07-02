import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(ROOT, '../public/images/equipment');
mkdirSync(OUT_DIR, { recursive: true });

// slug -> Wikimedia Commons search query
const TARGETS = {
  'telescopic-crane': 'telescopic crane truck construction',
  'scissor-lift': 'scissor lift construction site',
  'excavator': 'crawler excavator construction site',
  'forklift': 'forklift truck industrial',
  'mobile-crane': 'mobile crane construction site',
  'wheel-loader': 'wheel loader front bucket',
  'backhoe-loader': 'backhoe loader construction',
  'boom-lift': 'boom lift aerial work platform',
  'skid-steer': 'skid steer loader',
  'road-roller': 'road roller asphalt compactor',
  'tower-crane': 'tower crane silhouette sky construction site',
  'mini-excavator': 'mini excavator',
  'flatbed-truck': 'flatbed truck trailer',
  'asphalt-paver': 'asphalt paver machine road construction'
};

const HEADERS = { 'User-Agent': 'AlmoedatMockSite/1.0 (educational demo project)' };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 429 && attempt <= 4) {
      await sleep(attempt * 3000);
      return fetchWithRetry(url, attempt + 1);
    }
    return res;
  } catch (err) {
    if (attempt <= 4) {
      await sleep(attempt * 2000);
      return fetchWithRetry(url, attempt + 1);
    }
    throw err;
  }
}

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
    query + ' filetype:bitmap'
  )}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1000&format=json`;
  const res = await fetchWithRetry(url);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log(`  ! search API error: ${text.slice(0, 120)}`);
    return [];
  }
  const pages = data?.query?.pages;
  if (!pages) return [];
  const candidates = Object.values(pages)
    .filter((p) => p.imageinfo?.[0]?.mime === 'image/jpeg' || p.imageinfo?.[0]?.mime === 'image/png')
    .filter((p) => !/\.svg$/i.test(p.title));
  // prefer the highest-index (most relevant) results Commons returned
  candidates.sort((a, b) => a.index - b.index);
  return candidates;
}

async function fetchImageBuffer(url) {
  const res = await fetchWithRetry(url);
  const contentType = res.headers.get('content-type') ?? '';
  if (!res.ok || !contentType.startsWith('image/')) {
    throw new Error(`bad response: ${res.status} ${contentType}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function run() {
  const attributions = [];
  for (const [slug, query] of Object.entries(TARGETS)) {
    const outPath = path.join(OUT_DIR, `${slug}.jpg`);
    if (existsSync(outPath)) {
      console.log(`Skipping "${slug}" (already downloaded)`);
      continue;
    }
    try {
      console.log(`Searching "${query}"...`);
      await sleep(1200);
      const candidates = await searchCommons(query);
      let done = false;
      for (const page of candidates) {
        const info = page.imageinfo[0];
        const thumbUrl = info.thumburl ?? info.url;
        await sleep(1200);
        try {
          const buffer = await fetchImageBuffer(thumbUrl);
          await sharp(buffer)
            .resize({ width: 900, height: 600, fit: 'cover' })
            .jpeg({ quality: 76 })
            .toFile(outPath);

          const meta = info.extmetadata ?? {};
          attributions.push({
            slug,
            title: page.title.replace(/^File:/, ''),
            descriptionUrl: info.descriptionurl,
            artist: (meta.Artist?.value ?? '').replace(/<[^>]+>/g, '').trim() || 'Unknown',
            license: meta.LicenseShortName?.value ?? 'Unknown'
          });
          console.log(`  -> saved from ${page.title}`);
          done = true;
          break;
        } catch (err) {
          console.log(`  x skipped "${page.title}" (${err.message})`);
        }
      }
      if (!done) console.log('  ! NO USABLE IMAGE FOUND');
    } catch (err) {
      console.log(`  ! target "${slug}" failed entirely (${err.message})`);
    }
  }

  const lines = [
    '# Equipment photo attributions',
    '',
    'All photos sourced from Wikimedia Commons (freely licensed). Downloaded for use',
    'as equipment listing thumbnails in this demo project.',
    ''
  ];
  for (const a of attributions) {
    lines.push(`## ${a.slug}.jpg`);
    lines.push(`- Title: ${a.title}`);
    lines.push(`- Author: ${a.artist}`);
    lines.push(`- License: ${a.license}`);
    lines.push(`- Source: ${a.descriptionUrl}`);
    lines.push('');
  }
  writeFileSync(path.join(ROOT, '../public/images/equipment/ATTRIBUTIONS.md'), lines.join('\n'));
  console.log(`\nDone. ${attributions.length}/${Object.keys(TARGETS).length} images fetched.`);
}

run();
