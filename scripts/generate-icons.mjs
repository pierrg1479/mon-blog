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

/** Build a multi-size ICO file from PNG buffers (PNG-in-ICO format). */
function buildIco(pngBuffers, sizes) {
	const count = pngBuffers.length;
	const headerSize = 6;
	const dirEntrySize = 16;
	const dataOffset = headerSize + dirEntrySize * count;

	// Header: reserved(2) + type(2, 1=ICO) + count(2)
	const header = Buffer.alloc(headerSize);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(count, 4);

	const dirEntries = [];
	let offset = dataOffset;

	for (let i = 0; i < count; i++) {
		const entry = Buffer.alloc(dirEntrySize);
		const s = sizes[i] >= 256 ? 0 : sizes[i]; // 0 means 256
		entry.writeUInt8(s, 0);         // width
		entry.writeUInt8(s, 1);         // height
		entry.writeUInt8(0, 2);         // palette
		entry.writeUInt8(0, 3);         // reserved
		entry.writeUInt16LE(1, 4);      // color planes
		entry.writeUInt16LE(32, 6);     // bits per pixel
		entry.writeUInt32LE(pngBuffers[i].length, 8);  // data size
		entry.writeUInt32LE(offset, 12); // data offset
		dirEntries.push(entry);
		offset += pngBuffers[i].length;
	}

	return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

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

	// Generate multi-size favicon.ico (16x16, 32x32, 48x48)
	const icoPath = join(publicDir, 'favicon.ico');
	try {
		const icoSizes = [16, 32, 48];
		const pngBuffers = await Promise.all(
			icoSizes.map((s) => sharp(lightningSvg).resize(s, s).png().toBuffer())
		);
		await writeFile(icoPath, buildIco(pngBuffers, icoSizes), { flag: 'wx' });
		console.log(`Generated favicon.ico (${icoSizes.join(', ')})`);
	} catch (error) {
		if (error.code === 'EEXIST') {
			console.log('Skipped existing favicon.ico');
		} else {
			throw error;
		}
	}
}

ensureIcons().catch((error) => {
	console.error('Failed to generate icons', error);
	process.exit(1);
});
