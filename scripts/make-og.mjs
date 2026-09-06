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
  <rect width="1200" height="630" fill="#f4f6f9"/>
  <rect x="0" y="0" width="600" height="630" fill="#dfe8f1"/>
  <rect x="0" y="0" width="1200" height="8" fill="#2f62c4"/>

  <text x="600" y="250" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="66" letter-spacing="8" fill="#0f2136">ADAM LIGOCKI</text>
  <text x="600" y="305" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="22" letter-spacing="6" fill="#4b5d70">SOFTWARE · ROBOTICS · COMPUTER VISION · MACHINE LEARNING</text>

  <rect x="470" y="350" width="260" height="1" fill="#a9bbcd"/>

  <text x="260" y="452" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="62" fill="#0f2136">200</text>
  <text x="260" y="492" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="4" fill="#4b5d70">MACHINES IN THE FIELD</text>

  <text x="600" y="452" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="62" fill="#0f2136">13</text>
  <text x="600" y="492" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="4" fill="#4b5d70">YEARS OF ENGINEERING</text>

  <text x="940" y="452" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="62" fill="#0f2136">Ph.D.</text>
  <text x="940" y="492" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="4" fill="#4b5d70">SENSOR FUSION</text>

  <text x="600" y="575" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="3" fill="#7f95aa">adamek727.github.io/adam-ligocki-web</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);
console.log('wrote public/og.png');
