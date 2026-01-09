import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const equipment = [
	{ name: "Caméra Reolink E1 Pro", slug: 'camera-reolink-e1-pro', url: 'https://i5.walmartimages.com/seo/Reolink-E1-Pro-Black-4MP-HD-2-4-5ghz-WiFi-Wireless-AI-Detect-Indoor-Home-Security-Camera_f13c1b6f-6909-4a06-b863-93e080fe29fd.cc0c4eaceba2744cf41b4c50dcf29542.jpeg' },
	{ name: "Serrure Nuki Smart Lock", slug: 'serrure-nuki-smart-lock', url: 'https://media.crystallize.com/nuki-production/24/11/27/17/@1920/innovated-in-austria_pro_ultra.webp' },
	{ name: "Aqara Water Leak Sensor", slug: 'aqara-water-leak-sensor', url: 'https://m.media-amazon.com/images/I/61acsecUlxL._AC_SL1500_.jpg' },
	{ name: "Shelly Flood", slug: 'shelly-flood', url: 'https://shelly.pt/wp-content/uploads/2023/05/shelly-flood_image_001.webp' },
	{ name: "Aqara Temperature & Humidity", slug: 'aqara-temperature-humidity', url: 'https://pfetech.com/aqara/wp-content/uploads/temp-sensor/Temperature-and-Humidity-Sensor-T1.jpg' },
	{ name: "Sonoff SNZB-04 Contact", slug: 'sonoff-snzb-04-contact', url: 'https://community.hubitat.com/uploads/default/original/3X/7/5/755811b5f4acd5d77b9b54f0517e638c7e52a952.jpeg' },
	{ name: "Tado V3+ Thermostat", slug: 'tado-v3-thermostat', url: 'https://m.media-amazon.com/images/I/61fiMVYLXVL._AC_.jpg' },
	{ name: "Têtes thermostatiques Tado", slug: 'tetes-thermostatiques-tado', url: 'https://media.adeo.com/media/4721022/media.png?width=3000&height=3000&format=jpg&quality=80&fit=bounds' },
	{ name: "Roborock S8", slug: 'roborock-s8', url: 'https://m.media-amazon.com/images/I/71d5+PcCDlL._AC_SL1500_.jpg' },
	{ name: "Switchbot Bot", slug: 'switchbot-bot', url: 'https://i5.walmartimages.com/asr/0ffcb79d-d390-46e1-8717-d79b1e67b133.3055a9a9422d96a3f22a3f570c7d5caa.jpeg' },
	{ name: "Chromecast 4K", slug: 'chromecast-4k', url: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6425/6425976_sd.jpg' },
	{ name: "Amplificateur Sonos Amp", slug: 'amplificateur-sonos-amp', url: 'https://son-video-avenue.ma/wp-content/uploads/2024/02/sonos-amp-noir.jpg' },
	{ name: "Interrupteur Aqara H1", slug: 'interrupteur-aqara-h1', url: 'https://eu.aqara.com/cdn/shop/files/Aqara_Smart_Wall_Switch_H1_14.webp?v=1737614401&width=750' },
	{ name: "Ampoule Philips Hue White", slug: 'ampoule-philips-hue-white', url: 'https://www.assets.signify.com/is/image/Signify/8719514328341-929002489904-Hue_WA-8_5W-A60-B22-4P-EU-RTP-TRN' },
	{ name: "Ikea Shortcut Button", slug: 'ikea-shortcut-button', url: 'https://i.ytimg.com/vi/A2uBfHMuURE/maxresdefault.jpg' },
	{ name: "Aqara Wireless Mini Switch", slug: 'aqara-wireless-mini-switch', url: 'https://www.aqara.com/wp-content/uploads/2023/10/2560-wireless-mini-switch-T1_01.jpg' },
	{ name: "ConBee II Zigbee USB", slug: 'conbee-ii-zigbee-usb', url: 'https://www.kjell.com/globalassets/productimages/751641_51419.tif?ref=125451E2C3&format=jpg&w=960&h=960&mode=pad' },
	{ name: "Mini PC Home Assistant", slug: 'mini-pc-home-assistant', url: 'https://www.lesalexiens.fr/wp-content/uploads/2024/03/selection-mini-pc-home-assistant-proxmox-a-saisir.jpg' },
	{
		name: "Reolink Argus 4 Pro",
		slug: 'reolink-argus-4-pro',
		url: 'https://home-cdn.reolink.us/wp-content/uploads/2024/06/070511041717737064.7127.jpg.webp',
		localPath: 'scripts/assets/reolink-argus-4-pro.jpg',
	},
	{ name: "Tapo C225", slug: 'tapo-c225', url: 'https://static.tp-link.com/upload/image-line/Tapo-C225_EU_1.0_overview_05_large_20221128090030u.jpg' },
	{ name: "Reolink Lumus Pro", slug: 'reolink-lumus-pro', url: 'https://home-cdn.reolink.us/wp-content/uploads/2024/10/300852201730278340.2305.jpg.webp' },
	{ name: "Tapo C510W", slug: 'tapo-c510w', url: 'https://static.tp-link.com/upload/image-line/01_normal_20230420071916t.jpg' },
	{ name: "Reolink Argus 3 Ultra", slug: 'reolink-argus-3-ultra', url: 'https://home-cdn.reolink.us/wp-content/uploads/2023/11/090908511699520931.6711.jpg' },
	{ name: "Tapo C425", slug: 'tapo-c425', url: 'https://static.tp-link.com/upload/image-line/Tapo_C425(US)_1.0-180x150x84.5mm-7022510299_large_20240328055558w.png' },
	{ name: "Serrure SwitchBot Smart Lock Ultra", slug: 'serrure-switchbot-smart-lock-ultra', url: 'https://m.media-amazon.com/images/I/61UnLizGnPL._AC_SL1500_.jpg' },
	{ name: "SwitchBot Keypad Vision", slug: 'switchbot-keypad-vision', url: 'https://www.switch-bot.com/cdn/shop/files/Keypad_vision_JP_Amazon_Images_1000x1000_05_2x_2.webp?v=1747894218' },
	{ name: "SwitchBot Keypad Touch", slug: 'switchbot-keypad-touch', url: 'https://i5.walmartimages.com/seo/SwitchBot-Keypad-Touch-Smart-Keypad-for-SwitchBot-Lock-2-Years-Battery-Life-IP65_33f6b833-2a54-4f08-9d4c-f7a6b20a666b.f918e8ea7702fd3489ced62641dfbef5.jpeg' },
	{ name: "Capteur d'ouverture Sonoff SNZB-04P", slug: 'capteur-d-ouverture-sonoff-snzb-04p', url: 'https://sonoff.tech/cdn/shop/files/sonoff-zigbee-door-window-sensor-snzb-04p-3.jpg?v=1751008379&width=1200' },
	{ name: "Capteur d'ouverture Tapo T110", slug: 'capteur-d-ouverture-tapo-t110', url: 'https://static.tp-link.com/upload/image-line/Tapo_T110_04_large_20220616080629e.jpg' },
	{ name: "Détecteur de mouvement Sonoff SNZB-03P", slug: 'detecteur-de-mouvement-sonoff-snzb-03p', url: 'https://m.media-amazon.com/images/I/6135pMy+h6L._AC_.jpg' },
	{ name: "Détecteur de présence Sonoff SNZB-06P", slug: 'detecteur-de-presence-sonoff-snzb-06p', url: 'https://itead.cc/wp-content/uploads/2023/09/SNZB-06P_1000px_1.jpg' },
	{ name: "Capteur de pluie SNZB-05", slug: 'capteur-de-pluie-snzb-05', url: 'https://www.expert4house.com/img/cms/Sensori Acqua Smart/Sonoff SNZB-05P Rilevatore di Perdite dacqua Smart Zigbee IP67.jpg' },
	{ name: "Capteur de fuite Sonoff SNZB-05P", slug: 'capteur-de-fuite-sonoff-snzb-05p', url: 'https://www.expert4house.com/6792-large_default/sonoff-snzb-05p-capteur-de-fuite-d-eau-intelligent-zigbee.jpg' },
	{ name: "Capteur de vibration Third Reality 3RVS01031Z", slug: 'capteur-de-vibration-third-reality-3rvs01031z', url: 'https://zigbee.blakadder.com/assets/images/devices/Third_Reality_3RVS01031Z.webp' },
	{ name: "Capteur de température Sonoff SNZB-02LD", slug: 'capteur-de-temperature-sonoff-snzb-02ld', url: 'https://cdn2.domadoo.fr/33245-large_default/sonoff-capteur-de-temperature-zigbee-etanche-ip65-cable-deporte-snzb02ld.jpg' },
	{ name: "Capteur de fuite Tapo T300", slug: 'capteur-de-fuite-tapo-t300', url: 'https://static.tp-link.com/upload/image-line/8_large_20230725014222p.jpg' },
	{ name: "Capteur de température et humidité Tapo T310", slug: 'capteur-de-temperature-et-humidite-tapo-t310', url: 'https://static.tp-link.com/upload/image-line/Tapo_T310_2_normal_20231208011539o.jpg' },
	{ name: "Capteur de température et humidité Tapo T315", slug: 'capteur-de-temperature-et-humidite-tapo-t315', url: 'https://fr.store.tapo.com/cdn/shop/files/TAPOT315_OVERVIEW_1.jpg?v=1719853739' },
	{ name: "Capteur de luminosité TS0222", slug: 'capteur-de-luminosite-ts0222', url: 'https://community.jeedom.com/uploads/default/original/3X/7/1/71e8421cb38e4b71f7b0cf5536b9fcc53ab26b6b.png' },
	{ name: "Détecteur de fumée Heiman", slug: 'detecteur-de-fumee-heiman', url: 'https://m.media-amazon.com/images/I/71m44RpM3EL._AC_.jpg' },
	{ name: "Module fil pilote Nodon SIN-4-FP-21", slug: 'module-fil-pilote-nodon-sin-4-fp-21', url: 'https://haade.fr/assets/images/generated/posts/118/test-nodon-module-fil-pilote-sin-4fp-21-controle-dans-home-assistant-940-e96b56148.png' },
	{ name: "Robot Tondeuse Dream A1", slug: 'robot-tondeuse-dream-a1', url: 'https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc4/Dreame-A1-Maehroboter-Test-Bilder-Unterseite.jpg' },
	{ name: "Robot aspirateur Dream X50 Master", slug: 'robot-aspirateur-dream-x50-master', url: 'https://fr.dreametech.com/cdn/shop/files/Host-rag_external_expansion_2fa81370-733b-4479-9768-0ef74f5d9952_1024x1024.jpg?v=1735281769' },
	{ name: "Ampli Nad C700", slug: 'ampli-nad-c700', url: 'https://musikit.com/4126-large_default/nad-c700.jpg' },
	{ name: "Xiaomi TV Box S 3ème Génération", slug: 'xiaomi-tv-box-s-3eme-generation', url: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-tv-box-s-3rd-gen/pc/zewsxdrcftvgybhnj.jpg' },
	{ name: "Prise Tapo P110", slug: 'prise-tapo-p110', url: 'https://static.tp-link.com/upload/image-line/01_large_20210910081715c.jpg' },
	{ name: "Prise Tapo P110M", slug: 'prise-tapo-p110m', url: 'https://static.tp-link.com/upload/image-line/2_normal_20230913015222f.jpg' },
	{ name: "Prise Sonoff S60ZBTPF", slug: 'prise-sonoff-s60zbtpf', url: 'https://www.cnx-software.com/wp-content/uploads/2025/06/Sonoff_S60ZBTPF_AvailableModel.jpg' },
	{ name: "Interrupteur Tapo S210", slug: 'interrupteur-tapo-s210', url: 'https://static.tp-link.com/upload/image-line/overview_07_large_20230105093825m.jpg' },
	{ name: "Interrupteur Tapo S220", slug: 'interrupteur-tapo-s220', url: 'https://static.tp-link.com/upload/image-line/overview_06_large_20230105093533k.jpg' },
	{ name: "Interrupteur Sonoff ZBM5-1C-80/86", slug: 'interrupteur-sonoff-zbm5-1c-80-86', url: 'https://sonoff.tech/cdn/shop/files/SONOFF_SwitchMan_Zigbee_Smart_Wall_Switch-03.jpg?v=1751265059&width=1400' },
	{ name: "Bot Switchbot", slug: 'bot-switchbot', url: 'https://i5.walmartimages.com/asr/0ffcb79d-d390-46e1-8717-d79b1e67b133.3055a9a9422d96a3f22a3f570c7d5caa.jpeg' },
	{ name: "Fingerbot TS0001", slug: 'fingerbot-ts0001', url: 'https://cdn2.domadoo.fr/26391-large_default/adaprox-smart-button-fingerbot-zigbee-30-tuya-and-zigbee2mqtt.jpg' },
	{ name: "Bouton Tapo S200D", slug: 'bouton-tapo-s200d', url: 'https://www.neobyte.es/124416-thickbox_default/tp-link-tapo-s200d-boton-inteligente.jpg' },
	{ name: "Bouton Sonoff SNZB-01P", slug: 'bouton-sonoff-snzb-01p', url: 'https://shop.smarthome-europe.com/18054-thickbox_default/bouton-connecte-sans-fil-zigbee-30-snzb-01p-sonoff.jpg' },
	{ name: "Répéteur Zigbee Aeotec", slug: 'repeteur-zigbee-aeotec', url: 'https://cdn1.domadoo.fr/22259-large_default/aeotec-repeteur-routeur-zigbee-range-extender-zi-wg001.jpg' },
	{ name: "Home Assistant Green", slug: 'home-assistant-green', url: 'https://www.home-assistant.io/images/green/ha-green-box-contents.jpg' },
]

const outputDir = path.resolve('public/images/equipment');
await fs.mkdir(outputDir, { recursive: true });

const downloadImage = async ({ slug, url, name, localPath }) => {
	let buffer;
	if (localPath) {
		buffer = await fs.readFile(path.resolve(localPath));
	} else {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${name} (${response.status})`);
		}
		const arrayBuffer = await response.arrayBuffer();
		buffer = Buffer.from(arrayBuffer);
	}
	const outputPath = path.join(outputDir, `${slug}.webp`);
	await sharp(buffer)
		.resize(400, 400, { fit: 'contain', background: '#ffffff' })
		.webp({ quality: 70 })
		.toFile(outputPath);
};

const failures = [];

for (const item of equipment) {
	try {
		await downloadImage(item);
		console.log(`Saved ${item.slug}.webp`);
	} catch (error) {
		failures.push({ item, error: error.message });
		console.error(`Failed ${item.slug}: ${error.message}`);
	}
}

if (failures.length) {
	process.exitCode = 1;
}
