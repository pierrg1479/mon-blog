import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const sourceImage = join(publicDir, 'hannibal-cercle.png');

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
					await sharp(sourceImage).resize(size, size).png().toBuffer(),
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
