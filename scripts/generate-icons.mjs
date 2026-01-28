import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Path-based lightning bolt SVG for reliable rasterisation (librsvg cannot
// render emoji text).  The browser-facing favicon.svg uses an <text>⚡</text>
// element that the browser renders with the system emoji font.
const lightningSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M295 32 L112 272 L232 272 L176 480 L400 240 L272 240 Z"
        fill="#F4C622" stroke="#D4A017" stroke-width="8" stroke-linejoin="round"/>
</svg>`);

const outputs = [
	{ name: 'apple-touch-icon.png', size: 180 },
	{ name: 'favicon-48.png', size: 48 },
	{ name: 'favicon-96.png', size: 96 },
	{ name: 'icon-192.png', size: 192 },
	{ name: 'icon-512.png', size: 512 },
];

async function ensureIcons() {
	await mkdir(publicDir, { recursive: true });

	await Promise.all(
		outputs.map(async ({ name, size }) => {
			const destination = join(publicDir, name);

			// Skip generation if the file already exists to support local overrides.
			try {
				await writeFile(
					destination,
					await sharp(lightningSvg).resize(size, size).png().toBuffer(),
					{ flag: 'wx' }
				);
				console.log(`Generated ${name} (${size}x${size})`);
			} catch (error) {
				if (error.code === 'EEXIST') {
					console.log(`Skipped existing ${name}`);
					return;
				}
				throw error;
			}
		})
	);
}

ensureIcons().catch((error) => {
	console.error('Failed to generate icons', error);
	process.exit(1);
});
