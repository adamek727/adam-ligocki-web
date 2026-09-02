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
  <rect width="1200" height="630" fill="#0a1f33"/>
  <rect x="0" y="0" width="600" height="630" fill="#123a5c"/>

  <text x="600" y="250" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="66" letter-spacing="8" fill="#dfeaf3">ADAM LIGOCKI</text>
  <text x="600" y="305" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="23" letter-spacing="6" fill="#93b2c9">SOFTWARE · ROBOTICS · AI AND MACHINE LEARNING</text>

  <rect x="470" y="350" width="260" height="1" fill="#2f5a7c"/>

  <text x="260" y="452" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="62" fill="#dfeaf3">200</text>
  <text x="260" y="492" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="4" fill="#93b2c9">MACHINES IN THE FIELD</text>

  <text x="600" y="452" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="62" fill="#dfeaf3">13</text>
  <text x="600" y="492" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="4" fill="#93b2c9">YEARS OF ENGINEERING</text>

  <text x="940" y="452" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="62" fill="#dfeaf3">Ph.D.</text>
  <text x="940" y="492" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="4" fill="#93b2c9">SENSOR FUSION</text>

  <text x="600" y="575" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="3" fill="#6d8ba3">adamek727.github.io/adam-ligocki-web</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);
console.log('wrote public/og.png');
