import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, 'public', 'images', 'equipment');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// List of all image URLs from the file
const imageUrls = [
  'https://community.hubitat.com/uploads/default/original/3X/7/5/755811b5f4acd5d77b9b54f0517e638c7e52a952.jpeg',
  'https://m.media-amazon.com/images/I/61fiMVYLXVL._AC_.jpg',
  'https://media.adeo.com/media/4721022/media.png?width=3000&height=3000&format=jpg&quality=80&fit=bounds',
  'https://i5.walmartimages.com/asr/0ffcb79d-d390-46e1-8717-d79b1e67b133.3055a9a9422d96a3f22a3f570c7d5caa.jpeg',
  'https://home-cdn.reolink.us/wp-content/uploads/2024/06/070511041717737064.7127.jpg.webp',
  'https://static.tp-link.com/upload/image-line/Tapo-C225_EU_1.0_overview_05_large_20221128090030u.jpg',
  'https://home-cdn.reolink.us/wp-content/uploads/2024/10/300852201730278340.2305.jpg.webp',
  'https://static.tp-link.com/upload/image-line/01_normal_20230420071916t.jpg',
  'https://home-cdn.reolink.us/wp-content/uploads/2023/11/090908511699520931.6711.jpg',
  'https://static.tp-link.com/upload/image-line/Tapo_C425(US)_1.0-180x150x84.5mm-7022510299_large_20240328055558w.png',
  'https://m.media-amazon.com/images/I/61UnLizGnPL._AC_SL1500_.jpg',
  'https://www.switch-bot.com/cdn/shop/files/Keypad_vision_JP_Amazon_Images_1000x1000_05_2x_2.webp?v=1747894218',
  'https://i5.walmartimages.com/seo/SwitchBot-Keypad-Touch-Smart-Keypad-for-SwitchBot-Lock-2-Years-Battery-Life-IP65_33f6b833-2a54-4f08-9d4c-f7a6b20a666b.f918e8ea7702fd3489ced62641dfbef5.jpeg',
  'https://sonoff.tech/cdn/shop/files/sonoff-zigbee-door-window-sensor-snzb-04p-3.jpg?v=1751008379&width=1200',
  'https://static.tp-link.com/upload/image-line/Tapo_T110_04_large_20220616080629e.jpg',
  'https://m.media-amazon.com/images/I/6135pMy+h6L._AC_.jpg',
  'https://itead.cc/wp-content/uploads/2023/09/SNZB-06P_1000px_1.jpg',
  'https://www.expert4house.com/img/cms/Sensori Acqua Smart/Sonoff SNZB-05P Rilevatore di Perdite dacqua Smart Zigbee IP67.jpg',
  'https://www.expert4house.com/6792-large_default/sonoff-snzb-05p-capteur-de-fuite-d-eau-intelligent-zigbee.jpg',
  'https://zigbee.blakadder.com/assets/images/devices/Third_Reality_3RVS01031Z.webp',
  'https://cdn2.domadoo.fr/33245-large_default/sonoff-capteur-de-temperature-zigbee-etanche-ip65-cable-deporte-snzb02ld.jpg',
  'https://static.tp-link.com/upload/image-line/8_large_20230725014222p.jpg',
  'https://static.tp-link.com/upload/image-line/Tapo_T310_2_normal_20231208011539o.jpg',
  'https://fr.store.tapo.com/cdn/shop/files/TAPOT315_OVERVIEW_1.jpg?v=1719853739',
  'https://community.jeedom.com/uploads/default/original/3X/7/1/71e8421cb38e4b71f7b0cf5536b9fcc53ab26b6b.png',
  'https://m.media-amazon.com/images/I/71m44RpM3EL._AC_.jpg',
  'https://haade.fr/assets/images/generated/posts/118/test-nodon-module-fil-pilote-sin-4fp-21-controle-dans-home-assistant-940-e96b56148.png',
  'https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc4/Dreame-A1-Maehroboter-Test-Bilder-Unterseite.jpg',
  'https://fr.dreametech.com/cdn/shop/files/Host-rag_external_expansion_2fa81370-733b-4479-9768-0ef74f5d9952_1024x1024.jpg?v=1735281769',
  'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-tv-box-s-3rd-gen/pc/zewsxdrcftvgybhnj.jpg',
  'https://static.tp-link.com/upload/image-line/01_large_20210910081715c.jpg',
  'https://static.tp-link.com/upload/image-line/2_normal_20230913015222f.jpg',
  'https://www.cnx-software.com/wp-content/uploads/2025/06/Sonoff_S60ZBTPF_AvailableModel.jpg',
  'https://static.tp-link.com/upload/image-line/overview_07_large_20230105093825m.jpg',
  'https://static.tp-link.com/upload/image-line/overview_06_large_20230105093533k.jpg',
  'https://sonoff.tech/cdn/shop/files/SONOFF_SwitchMan_Zigbee_Smart_Wall_Switch-03.jpg?v=1751265059&width=1400',
  'https://cdn2.domadoo.fr/26391-large_default/adaprox-smart-button-fingerbot-zigbee-30-tuya-and-zigbee2mqtt.jpg',
  'https://www.neobyte.es/124416-thickbox_default/tp-link-tapo-s200d-boton-inteligente.jpg',
  'https://shop.smarthome-europe.com/18054-thickbox_default/bouton-connecte-sans-fil-zigbee-30-snzb-01p-sonoff.jpg',
  'https://cdn1.domadoo.fr/22259-large_default/aeotec-repeteur-routeur-zigbee-range-extender-zi-wg001.jpg',
  'https://www.home-assistant.io/images/green/ha-green-box-contents.jpg',
];

// Generate a clean filename from URL
function getFilename(url, index) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const ext = path.extname(pathname) || '.jpg';

  // Create a hash of the URL for uniqueness
  const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);

  // Use index and hash to create unique filename
  return `product-${index + 1}-${hash}${ext}`;
}

// Download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve(filepath);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

// Main download function
async function downloadAllImages() {
  console.log(`Starting download of ${imageUrls.length} images...\n`);

  const mapping = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const filename = getFilename(url, i);
    const filepath = path.join(outputDir, filename);

    try {
      await downloadImage(url, filepath);
      mapping.push({ url, filename });
    } catch (error) {
      console.error(`✗ Failed to download ${url}:`, error.message);
      mapping.push({ url, filename: null, error: error.message });
    }

    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save mapping to JSON file
  const mappingPath = path.join(__dirname, 'image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n✓ Image mapping saved to: ${mappingPath}`);

  const successful = mapping.filter(m => m.filename).length;
  console.log(`\n✓ Downloaded ${successful}/${imageUrls.length} images successfully`);
}

downloadAllImages().catch(console.error);
