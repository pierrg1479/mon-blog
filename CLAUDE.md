# The Optimization Guy

Blog domotique (Home Assistant) de Pierre : https://www.the-optimization-guy.com

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
