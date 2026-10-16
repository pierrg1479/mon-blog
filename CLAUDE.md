# The Optimization Guy

Blog domotique (Home Assistant) de Pierre : https://www.the-optimization-guy.com

## Objectif

Faire du blog une référence Home Assistant en français et en anglais, avec du trafic organique venant de Google et des moteurs de réponse IA (ChatGPT, Perplexity, AI Overviews).

- L'avantage du blog, c'est le vécu : chaque article raconte une installation réelle, avec des chiffres, des captures et des automatisations qui tournent vraiment chez Pierre. C'est ce qui le distingue des articles génériques.
- Pas de rythme de publication fixe : un article sort quand un projet domotique est terminé et éprouvé. La qualité et la précision priment sur la fréquence.
- Mettre à jour les articles existants (nouvelles données, retour après plusieurs mois) fait partie de l'objectif autant que d'en écrire de nouveaux.
- Les liens d'affiliation sont un complément, jamais la raison d'être d'un article.

## Process d'un article

1. **Sujet** : partir d'un projet réel. Vérifier dans Home Assistant (MCP) ce qui existe : appareils, automatisations, historique. Vérifier qu'aucun article existant ne couvre déjà le sujet (sinon, proposer une mise à jour).
2. **Plan** : proposer à Pierre un plan (H2) et un angle avant de rédiger. Identifier la requête principale visée.
3. **Rédaction FR** dans `src/content/blog/<slug>.mdx`, en suivant "Ton et style" et "Règles SEO". Ce qui ne peut pas être vérifié (prix, ressenti, durée d'usage) est demandé à Pierre, pas inventé.
4. **Images** : dans `public/images/<slug>/`, hero dans `src/assets/`. Flouter ou recadrer tout ce qui relève de la confidentialité (noms, caméras, adresse).
5. **Traduction EN** dans `src/content/blog-en/<slug-traduit>.mdx` : adapter (unités, exemples, requêtes anglaises), pas traduire mot à mot. Ajouter la paire de slugs dans `frToEnSlugMap` (`src/pages/blog/[...slug].astro`) et `enToFrSlugMap` (`src/pages/en/blog/[...slug].astro`).
6. **Relecture confidentialité** : repasser l'article et le YAML contre la section "Confidentialité" ci-dessous.
7. **Build** : `npm run build` doit passer sans erreur, puis PR (voir "Git et déploiement").

## Ton et style

- Première personne ("j'ai installé", "chez moi"), le lecteur est vouvoyé.
- Ton direct et honnête : donner son avis, y compris négatif ("49,90 € pour un morceau de plastique, c'est clairement abusé"). Citer les vrais prix payés et les vrais chiffres.
- Structure type : intro courte (le problème de départ), matériel utilisé, étapes ou sections H2, résultat chiffré ou retour d'expérience, conclusion, FAQ.
- Phrases courtes, paragraphes de 2 à 4 lignes, listes pour le matériel et les caractéristiques.
- Composants disponibles (`src/components/`) : `AffiliateInline` (produit recommandé), `FaqBlock` (FAQ en fin d'article), `ReadAlso` (lien vers un autre article), `TallyEmbed`.
- Code YAML toujours replié dans `<details><summary>Voir le code YAML</summary>` (EN : "View YAML code").
- Images en `<figure>` + `<figcaption>`, avec un texte alternatif descriptif.
- Pas de tirets cadratins.

## Règles SEO

- `title` (balise title, 60 caractères environ) contient la requête principale ; `h1` peut être plus naturel. `description` : 140 à 160 caractères, concrète, donne envie de cliquer.
- Slug court, en minuscules, avec la requête principale, sans mots vides inutiles.
- Une seule idée de requête principale par article ; les H2 couvrent les questions secondaires (que les gens cherchent réellement).
- FAQ (`FaqBlock`) avec de vraies questions de lecteurs : elle sert aussi aux moteurs IA.
- Maillage interne : au moins 2 liens vers d'autres articles du blog, et mettre à jour les anciens articles pertinents pour pointer vers le nouveau.
- Alt text descriptif sur chaque image, noms de fichiers explicites (`tablette-dashboard.jpg`, pas `IMG_1234.jpg`).
- Mettre `updatedDate` dans le frontmatter lors d'une mise à jour significative.
- Les liens externes vers les produits et les sites officiels sont vérifiés (pas de 404).

## Git et déploiement

- Ne jamais pousser directement sur `main` : tout push sur `main` déploie en production.
- Travailler sur une branche (`article/<slug>`, `fix/...`, `docs/...`), puis ouvrir une PR vers `main`.
- `npm run build` doit passer avant d'ouvrir la PR. Vérifier la preview Vercel de la PR.
- Messages de commit courts, en français, à l'impératif ("Ajoute l'article...", "Corrige le lien...").
- Ne commiter ni brouillon contenant des données privées, ni fichier `.env`.

## Stack

- Astro 5 + MDX, déployé sur Vercel (projet `mon-blog-7fwy`) à chaque push sur `main`.
- Articles FR : `src/content/blog/`, articles EN : `src/content/blog-en/`. Chaque article FR publié a son équivalent EN (slug traduit).
- Schéma du frontmatter : `src/content.config.ts`.
- Commandes : `npm run dev`, `npm run build`.

## Home Assistant (MCP)

Le serveur MCP Home Assistant (outils `mcp__Home_Assistant__*`) donne accès à l'installation réelle de Pierre. Il est configuré dans l'app Claude, pas dans ce dépôt.

- Pour écrire ou mettre à jour un article, partir de l'installation réelle : appareils, intégrations, automatisations, scripts, helpers et dashboards existants (`ha_search`, `ha_config_get_automation`, `ha_get_history`...). Ne pas inventer un appareil ou une automatisation que Pierre n'a pas.
- Lecture seule par défaut. Ne jamais créer, modifier, supprimer ni déclencher quoi que ce soit dans Home Assistant (automatisations, services, alarme, serrures, caméras...) sans demande explicite de Pierre.
- Avant d'utiliser le MCP, lire le guide de bonnes pratiques (`ha_get_skill_guide`), notamment pour les exemples d'automatisations publiés dans les articles.

## Confidentialité (le dépôt et le site sont publics)

Ne jamais publier, dans un article ou dans un commit :

- l'URL d'accès à Home Assistant (Nabu Casa), adresses IP, tokens, identifiants d'appareils, codes d'alarme ;
- les prénoms des membres de la famille ni les noms de pièces qui les contiennent (ex. "chambre de X") : utiliser des noms génériques ("chambre enfant", "chambre d'amis") ;
- la localisation précise de la maison, les zones (travail...), les horaires d'absence, l'état de l'alarme, des serrures ou des caméras ;
- les adresses e-mail et calendriers personnels.

Dans les extraits YAML publiés, remplacer les `entity_id` personnels par des noms génériques.
