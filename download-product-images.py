#!/usr/bin/env python3
"""
Script pour télécharger et optimiser les images produits pour mon-materiel
Exécutez ce script localement pour télécharger toutes les images
"""

import os
import re
import requests
from pathlib import Path
from urllib.parse import urlparse, unquote
from PIL import Image
from io import BytesIO
import hashlib

# Configuration
OUTPUT_DIR = Path("public/images/equipment")
MAX_WIDTH = 800  # Largeur maximale pour optimisation
QUALITY = 85  # Qualité WEBP

# Liste des URLs d'images à télécharger
IMAGE_URLS = {
    "sonoff-snzb-04-contact": "https://community.hubitat.com/uploads/default/original/3X/7/5/755811b5f4acd5d77b9b54f0517e638c7e52a952.jpeg",
    "tado-v3-thermostat": "https://m.media-amazon.com/images/I/61fiMVYLXVL._AC_.jpg",
    "tetes-thermostatiques-tado": "https://media.adeo.com/media/4721022/media.png?width=3000&height=3000&format=jpg&quality=80&fit=bounds",
    "switchbot-bot": "https://i5.walmartimages.com/asr/0ffcb79d-d390-46e1-8717-d79b1e67b133.3055a9a9422d96a3f22a3f570c7d5caa.jpeg",
    "reolink-argus-4-pro": "https://home-cdn.reolink.us/wp-content/uploads/2024/06/070511041717737064.7127.jpg.webp",
    "tapo-c225": "https://static.tp-link.com/upload/image-line/Tapo-C225_EU_1.0_overview_05_large_20221128090030u.jpg",
    "reolink-lumus-pro": "https://home-cdn.reolink.us/wp-content/uploads/2024/10/300852201730278340.2305.jpg.webp",
    "tapo-c510w": "https://static.tp-link.com/upload/image-line/01_normal_20230420071916t.jpg",
    "reolink-argus-3-ultra": "https://home-cdn.reolink.us/wp-content/uploads/2023/11/090908511699520931.6711.jpg",
    "tapo-c425": "https://static.tp-link.com/upload/image-line/Tapo_C425(US)_1.0-180x150x84.5mm-7022510299_large_20240328055558w.png",
    "serrure-switchbot-smart-lock-ultra": "https://m.media-amazon.com/images/I/61UnLizGnPL._AC_SL1500_.jpg",
    "switchbot-keypad-vision": "https://www.switch-bot.com/cdn/shop/files/Keypad_vision_JP_Amazon_Images_1000x1000_05_2x_2.webp?v=1747894218",
    "switchbot-keypad-touch": "https://i5.walmartimages.com/seo/SwitchBot-Keypad-Touch-Smart-Keypad-for-SwitchBot-Lock-2-Years-Battery-Life-IP65_33f6b833-2a54-4f08-9d4c-f7a6b20a666b.f918e8ea7702fd3489ced62641dfbef5.jpeg",
    "capteur-ouverture-sonoff-snzb-04p": "https://sonoff.tech/cdn/shop/files/sonoff-zigbee-door-window-sensor-snzb-04p-3.jpg?v=1751008379&width=1200",
    "capteur-ouverture-tapo-t110": "https://static.tp-link.com/upload/image-line/Tapo_T110_04_large_20220616080629e.jpg",
    "detecteur-de-mouvement-sonoff-snzb-03p": "https://m.media-amazon.com/images/I/6135pMy+h6L._AC_.jpg",
    "detecteur-de-presence-sonoff-snzb-06p": "https://itead.cc/wp-content/uploads/2023/09/SNZB-06P_1000px_1.jpg",
    "capteur-de-pluie-snzb-05": "https://www.expert4house.com/img/cms/Sensori Acqua Smart/Sonoff SNZB-05P Rilevatore di Perdite dacqua Smart Zigbee IP67.jpg",
    "capteur-de-fuite-sonoff-snzb-05p": "https://www.expert4house.com/6792-large_default/sonoff-snzb-05p-capteur-de-fuite-d-eau-intelligent-zigbee.jpg",
    "capteur-de-vibration-third-reality-3rvs01031z": "https://zigbee.blakadder.com/assets/images/devices/Third_Reality_3RVS01031Z.webp",
    "capteur-de-temperature-sonoff-snzb-02ld": "https://cdn2.domadoo.fr/33245-large_default/sonoff-capteur-de-temperature-zigbee-etanche-ip65-cable-deporte-snzb02ld.jpg",
    "capteur-de-fuite-tapo-t300": "https://static.tp-link.com/upload/image-line/8_large_20230725014222p.jpg",
    "capteur-de-temperature-et-humidite-tapo-t310": "https://static.tp-link.com/upload/image-line/Tapo_T310_2_normal_20231208011539o.jpg",
    "capteur-de-temperature-et-humidite-tapo-t315": "https://fr.store.tapo.com/cdn/shop/files/TAPOT315_OVERVIEW_1.jpg?v=1719853739",
    "capteur-de-luminosite-ts0222": "https://community.jeedom.com/uploads/default/original/3X/7/1/71e8421cb38e4b71f7b0cf5536b9fcc53ab26b6b.png",
    "detecteur-de-fumee-heiman": "https://m.media-amazon.com/images/I/71m44RpM3EL._AC_.jpg",
    "module-fil-pilote-nodon-sin-4-fp-21": "https://haade.fr/assets/images/generated/posts/118/test-nodon-module-fil-pilote-sin-4fp-21-controle-dans-home-assistant-940-e96b56148.png",
    "robot-tondeuse-dream-a1": "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc4/Dreame-A1-Maehroboter-Test-Bilder-Unterseite.jpg",
    "robot-aspirateur-dream-x50-master": "https://fr.dreametech.com/cdn/shop/files/Host-rag_external_expansion_2fa81370-733b-4479-9768-0ef74f5d9952_1024x1024.jpg?v=1735281769",
    "xiaomi-tv-box-s-3eme-generation": "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-tv-box-s-3rd-gen/pc/zewsxdrcftvgybhnj.jpg",
    "prise-tapo-p110": "https://static.tp-link.com/upload/image-line/01_large_20210910081715c.jpg",
    "prise-tapo-p110m": "https://static.tp-link.com/upload/image-line/2_normal_20230913015222f.jpg",
    "prise-sonoff-s60zbtpf": "https://www.cnx-software.com/wp-content/uploads/2025/06/Sonoff_S60ZBTPF_AvailableModel.jpg",
    "interrupteur-tapo-s210": "https://static.tp-link.com/upload/image-line/overview_07_large_20230105093825m.jpg",
    "interrupteur-tapo-s220": "https://static.tp-link.com/upload/image-line/overview_06_large_20230105093533k.jpg",
    "interrupteur-sonoff-zbm5-1c-80-86": "https://sonoff.tech/cdn/shop/files/SONOFF_SwitchMan_Zigbee_Smart_Wall_Switch-03.jpg?v=1751265059&width=1400",
    "bot-switchbot": "https://i5.walmartimages.com/asr/0ffcb79d-d390-46e1-8717-d79b1e67b133.3055a9a9422d96a3f22a3f570c7d5caa.jpeg",
    "fingerbot-ts0001": "https://cdn2.domadoo.fr/26391-large_default/adaprox-smart-button-fingerbot-zigbee-30-tuya-and-zigbee2mqtt.jpg",
    "bouton-tapo-s200d": "https://www.neobyte.es/124416-thickbox_default/tp-link-tapo-s200d-boton-inteligente.jpg",
    "bouton-sonoff-snzb-01p": "https://shop.smarthome-europe.com/18054-thickbox_default/bouton-connecte-sans-fil-zigbee-30-snzb-01p-sonoff.jpg",
    "repeteur-zigbee-aeotec": "https://cdn1.domadoo.fr/22259-large_default/aeotec-repeteur-routeur-zigbee-range-extender-zi-wg001.jpg",
    "home-assistant-green": "https://www.home-assistant.io/images/green/ha-green-box-contents.jpg",
}


def download_image(url, filename):
    """Télécharge une image depuis une URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.content
    except Exception as e:
        print(f"❌ Erreur lors du téléchargement de {filename}: {e}")
        return None


def optimize_image(image_data, max_width=MAX_WIDTH):
    """Optimise l'image : redimensionne et convertit en WebP"""
    try:
        img = Image.open(BytesIO(image_data))

        # Convertir en RGB si nécessaire (pour les PNG avec transparence)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Créer un fond blanc
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Redimensionner si nécessaire
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

        # Sauvegarder en WebP
        output = BytesIO()
        img.save(output, format='WEBP', quality=QUALITY, method=6)
        return output.getvalue()
    except Exception as e:
        print(f"❌ Erreur lors de l'optimisation: {e}")
        return None


def main():
    """Télécharge et optimise toutes les images"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"📥 Téléchargement de {len(IMAGE_URLS)} images...\n")

    success_count = 0
    fail_count = 0

    for filename, url in IMAGE_URLS.items():
        output_path = OUTPUT_DIR / f"{filename}.webp"

        # Ignorer si le fichier existe déjà
        if output_path.exists():
            print(f"⏭️  {filename}.webp existe déjà, ignoré")
            continue

        print(f"📥 Téléchargement: {filename}...")

        # Télécharger
        image_data = download_image(url, filename)
        if not image_data:
            fail_count += 1
            continue

        # Optimiser
        print(f"⚙️  Optimisation: {filename}...")
        optimized_data = optimize_image(image_data)
        if not optimized_data:
            fail_count += 1
            continue

        # Sauvegarder
        output_path.write_bytes(optimized_data)
        size_kb = len(optimized_data) / 1024
        print(f"✅ Sauvegardé: {filename}.webp ({size_kb:.1f} KB)\n")
        success_count += 1

    print(f"\n{'='*50}")
    print(f"✅ Succès: {success_count}/{len(IMAGE_URLS)}")
    print(f"❌ Échecs: {fail_count}/{len(IMAGE_URLS)}")
    print(f"{'='*50}")

    if success_count > 0:
        print("\n✨ Les images ont été téléchargées et optimisées avec succès!")
        print(f"📁 Emplacement: {OUTPUT_DIR.absolute()}")


if __name__ == "__main__":
    # Vérifier les dépendances
    try:
        import requests
        from PIL import Image
    except ImportError as e:
        print("❌ Dépendances manquantes!")
        print("\nInstallez les dépendances avec:")
        print("  pip install requests pillow")
        exit(1)

    main()
