/*
 * Generates the static Open Graph card at public/og.png.
 *
 * Colours mirror the dark theme in src/styles/tokens.css. sharp comes with
 * Astro's image pipeline, so this needs no extra dependency. Re-run with
 * `npm run og` after changing the palette or the tagline.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0f1113"/>
  <rect x="0" y="0" width="1200" height="8" fill="#6aa4e8"/>
  <text x="80" y="270" font-family="Helvetica, Arial, sans-serif" font-size="86"
        font-weight="700" fill="#e6e8ea">Adam Ligocki</text>
  <text x="80" y="345" font-family="Helvetica, Arial, sans-serif" font-size="38"
        fill="#a3a8ae">Robotics · Computer Vision · Machine Learning</text>
  <text x="80" y="540" font-family="Helvetica, Arial, sans-serif" font-size="30"
        fill="#707680">adamek727.github.io/adam-ligocki-web</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);
console.log('wrote public/og.png');
