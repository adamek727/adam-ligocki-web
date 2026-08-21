/*
 * Internal link checker for the built site.
 *
 * Walks every HTML file in dist/, collects href and src targets, and verifies
 * that each local one resolves to a file that exists. Links carrying a
 * fragment are checked twice: the document must exist, and it must contain an
 * element with that id — that second check is what catches a heading anchor
 * silently changing.
 *
 * External URLs are ignored on purpose. This gate is about links we control;
 * failing a pull request because someone else's server is down would make it
 * untrustworthy, and an untrusted gate gets bypassed.
 *
 * Root-relative hrefs carry the deployed base path (e.g. /adam-ligocki-web),
 * which is not part of dist/ itself, so the base is stripped before
 * resolving. It is read from SITE_BASE exactly like astro.config.mjs does.
 *
 * Usage: node scripts/check-links.mjs [distDir]
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const basePath = (process.env.SITE_BASE ?? '/adam-ligocki-web').replace(/\/$/, '');

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function targets(html) {
  return [...html.matchAll(/(?:href|src)="([^"]+)"/gi)].map((m) => m[1]);
}

/** Resolve a link to a file on disk, or null when it does not exist. */
function resolveTarget(link, fromFile) {
  const fromDir = path.dirname(fromFile);
  let absolute = link;
  if (basePath && absolute.startsWith(`${basePath}/`)) {
    absolute = absolute.slice(basePath.length);
  } else if (basePath && absolute === basePath) {
    absolute = '/';
  }

  const rel = absolute.startsWith('/')
    ? path.join(dist, absolute.slice(1))
    : path.resolve(fromDir, absolute);

  if (existsSync(rel) && !rel.endsWith(path.sep)) {
    const asIndex = path.join(rel, 'index.html');
    if (existsSync(asIndex)) return asIndex;
    return rel;
  }
  const withIndex = path.join(rel, 'index.html');
  if (existsSync(withIndex)) return withIndex;
  return null;
}

const files = await htmlFiles(dist);
const broken = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const raw of targets(html)) {
    if (!raw || EXTERNAL.test(raw) || raw.startsWith('#') || raw.startsWith('?')) continue;

    const [pathPart, fragment] = decodeURI(raw).split("#");
    const resolved = resolveTarget(pathPart.split('?')[0], file);
    const where = path.relative(dist, file);

    if (!resolved) {
      broken.push(`${where} -> ${raw} (no such file)`);
      continue;
    }
    if (fragment && resolved.endsWith('.html')) {
      const target = await readFile(resolved, 'utf8');
      if (!target.includes(`id="${fragment}"`)) {
        broken.push(`${where} -> ${raw} (no element with id="${fragment}")`);
      }
    }
  }
}

if (broken.length > 0) {
  console.error(`${broken.length} broken link(s):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}

console.log(`OK: ${files.length} pages, no broken internal links`);
