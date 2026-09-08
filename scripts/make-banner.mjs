/*
 * Generates a LinkedIn profile banner at build/linkedin-banner.png, in the same
 * light palette as the site and the Open Graph card.
 *
 * 1584 x 396 is LinkedIn's banner size. The profile photo overlaps the
 * bottom-left corner on desktop, so everything that matters sits in the right
 * two thirds and the top three quarters. Re-run with `npm run banner`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396">
  <defs>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.4" fill="#2f62c4" opacity="0.32"/>
    </pattern>
  </defs>
  <rect width="1584" height="396" fill="#f4f6f9"/>
  <rect width="560" height="396" fill="#dfe8f1"/>
  <rect width="560" height="396" fill="url(#dots)"/>
  <rect width="1584" height="8" fill="#2f62c4"/>

  <text x="660" y="150" font-family="Georgia, 'Times New Roman', serif"
        font-size="56" letter-spacing="7" fill="#0f2136">ADAM LIGOCKI</text>
  <text x="660" y="194" font-family="Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="5" fill="#4b5d70">SOFTWARE · ROBOTICS · COMPUTER VISION · MACHINE LEARNING</text>
  <rect x="660" y="224" width="300" height="1" fill="#a9bbcd"/>

  <text x="660" y="308" font-family="Georgia, 'Times New Roman', serif" font-size="48" fill="#0f2136">200</text>
  <text x="660" y="340" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="3" fill="#4b5d70">MACHINES IN THE FIELD</text>

  <text x="930" y="308" font-family="Georgia, 'Times New Roman', serif" font-size="48" fill="#0f2136">13</text>
  <text x="930" y="340" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="3" fill="#4b5d70">YEARS OF ENGINEERING</text>

  <text x="1270" y="308" font-family="Georgia, 'Times New Roman', serif" font-size="48" fill="#0f2136">Ph.D.</text>
  <text x="1270" y="340" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="3" fill="#4b5d70">SENSOR FUSION</text>

  <text x="1524" y="372" text-anchor="end" font-family="Helvetica, Arial, sans-serif"
        font-size="15" letter-spacing="2" fill="#7f95aa">adamek727.github.io/adam-ligocki-web</text>
</svg>`;

await mkdir(new URL('../build/', import.meta.url), { recursive: true });
const out = new URL('../build/linkedin-banner.png', import.meta.url);
await writeFile(out, await sharp(Buffer.from(svg)).png().toBuffer());
console.log('wrote build/linkedin-banner.png');
