# Instructions pour télécharger les images produits

## Problème résolu

Toutes les images de la page `/mon-materiel/` ont été migrées vers des chemins locaux au lieu d'URLs externes. Cela résout :

- ✅ Problème de "hotlinking" (hébergement des images sur d'autres sites)
- ✅ Amélioration des performances de chargement
- ✅ Meilleur contrôle sur les images
- ✅ Réduction des risques de liens brisés

## Téléchargement des images

Les images produits doivent être téléchargées et optimisées localement. Deux options s'offrent à vous :

### Option 1 : Script Python (Recommandé)

Le script `download-product-images.py` télécharge automatiquement toutes les images, les optimise et les convertit en WebP.

**Prérequis :**
```bash
pip install requests pillow
```

**Exécution :**
```bash
python3 download-product-images.py
```

Le script va :
- Télécharger toutes les images produits depuis leurs sources
- Les redimensionner (largeur max : 800px)
- Les convertir en WebP avec fond blanc
- Les sauvegarder dans `public/images/equipment/`
- Optimiser la qualité (85%) pour réduire la taille

### Option 2 : Téléchargement manuel

Si vous préférez télécharger les images manuellement :

1. Consultez le fichier `download-product-images.py` pour voir la liste des URLs
2. Téléchargez chaque image
3. Optimisez-les (format WebP recommandé)
4. Placez-les dans `public/images/equipment/` avec les noms correspondants

## Structure des fichiers

Toutes les images doivent être placées dans :
```
public/images/equipment/
```

Format de nommage :
```
nom-du-produit.webp
```

Exemples :
- `tado-v3-thermostat.webp`
- `reolink-argus-4-pro.webp`
- `switchbot-keypad-vision.webp`

## Images SVG de secours

Le dossier `public/images/equipment/` contient déjà des fichiers SVG placeholder pour tous les produits. Ces images seront utilisées temporairement si les vraies images ne sont pas encore téléchargées.

## Optimisation recommandée

Pour les meilleures performances :
- **Format** : WebP
- **Largeur max** : 800px
- **Qualité** : 85%
- **Fond** : Blanc (#FFFFFF)
- **Taille cible** : < 100KB par image

## Vérification

Après avoir téléchargé les images, vérifiez que tout fonctionne :

```bash
npm run build
```

Si le build réussit, les images sont correctement configurées !

## Aide

Si vous rencontrez des problèmes :
1. Vérifiez que toutes les dépendances Python sont installées
2. Assurez-vous d'avoir les permissions d'écriture dans `public/images/equipment/`
3. Vérifiez votre connexion internet pour le téléchargement

## Maintenance

Quand vous ajoutez un nouveau produit :
1. Ajoutez l'URL de l'image dans `download-product-images.py`
2. Relancez le script pour télécharger la nouvelle image
3. Mettez à jour `src/pages/mon-materiel.astro` avec le chemin local
