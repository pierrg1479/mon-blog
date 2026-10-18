# The Optimization Guy

Blog domotique (Home Assistant) de Pierre : https://www.the-optimization-guy.com

## Objectif

Faire du blog une référence Home Assistant en français et en anglais, avec du trafic organique venant de Google et des moteurs de réponse IA (ChatGPT, Perplexity, AI Overviews).

- L'avantage du blog, c'est le vécu : chaque article raconte une installation réelle, avec des chiffres, des captures et des automatisations qui tournent vraiment chez Pierre. C'est ce qui le distingue des articles génériques.
- Pas de rythme de publication fixe : un article sort quand un projet domotique est terminé et éprouvé. La qualité et la précision priment sur la fréquence.
- Mettre à jour les articles existants (nouvelles données, retour après plusieurs mois) fait partie de l'objectif autant que d'en écrire de nouveaux.
- Les liens d'affiliation sont un complément, jamais la raison d'être d'un article.

## Process d'un article

1. **Sujet** : partir d'un projet réel. Vérifier dans Home Assistant (MCP) ce qui existe : appareils, automatisations, historique. Nommer l'intention de recherche et faire le contrôle de cannibalisation (voir "Règles SEO").
2. **Plan, arrêt 1** : proposer à Pierre, en texte, l'angle, la requête principale, le H1, le `title`, la `description`, les H2/H3, les questions de FAQ, les liens internes visés et les questions ouvertes. Ne pas écrire une ligne avant sa validation : "vas-y" ou "fais les trois" commande le travail, pas un plan qui n'existe pas encore.
3. **Rédaction FR** dans `src/content/blog/<slug>.mdx`, en suivant "Ton et style" et "Règles SEO". Ce qui ne peut pas être vérifié (prix, ressenti, durée d'usage) est demandé à Pierre, pas inventé.
4. **Images** : dans `public/images/<slug>/`, hero dans `src/assets/`. Flouter ou recadrer tout ce qui relève de la confidentialité (noms, caméras, adresse).
5. **Traduction EN** dans `src/content/blog-en/<slug-traduit>.mdx` : adapter (unités, exemples, requêtes anglaises), pas traduire mot à mot. Ajouter la paire de slugs dans `frToEnSlugMap` (`src/translations.mjs`) : elle alimente le hreflang des deux articles et du sitemap. Une nouvelle page hors blog traduite s'ajoute dans `frToEnPaths`, même fichier.
6. **Relecture confidentialité** : repasser l'article et le YAML contre la section "Confidentialité" ci-dessous.
7. **Rendu, arrêt 2** : `npm run build` sans erreur, puis montrer à Pierre le rendu local (390 px et 1280 px) et la liste de ce qui reste ouvert (photos, faits à confirmer). Commit et push sur `main` seulement après son accord (voir "Git et déploiement").

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

Adaptées des règles d'article du site Guibolles (`guibolles-site/.claude/skills/article/`).

Elles s'appliquent aux nouveaux articles. Les 5 articles publiés avant octobre 2026 ne sont pas à remettre en conformité (décision de Pierre du 16/10/2026) : ne pas proposer de les réoptimiser.

### Intention et cannibalisation

- Une page, une intention, une requête principale. Le blog prend l'intention informationnelle ("comment", "avis", "retour d'expérience") ; un comparatif d'achat pur reste possible mais toujours appuyé sur du vécu.
- Contrôle obligatoire avant d'écrire, en FR et en EN :

  ```bash
  grep -ril "<mot-clé>" src/content/blog src/content/blog-en
  ```

  Trancher dans le plan : aucun article proche (on écrit) ; article proche d'intention différente (on écrit et on lie les deux) ; article proche de même intention (on n'écrit pas, on met à jour l'existant).

### Title et description

- Le `title` est publié tel quel, sans suffixe de marque : **65 caractères au plus**, requête principale le plus à gauche possible. Il décrit la page, il ne l'emballe pas.
- Le `h1` peut être plus naturel que le `title`, mais un seul H1 par page.
- `description` : **150 caractères au plus**, unique sur le site, contient la requête ciblée, **commence par un verbe d'action** (Automatisez, Réduisez, Installez...) et dit ce que le lecteur va obtenir, pas ce que la page contient. Jamais "Cet article vous explique".
- Ni prix, ni point d'exclamation dans la `description` : un prix périme sans prévenir.
- Slug court, en minuscules, avec la requête principale. Ne jamais changer le slug ou le `title` d'un article qui ramène du trafic sans relevé avant/après.

### Structure et dosage

- Chapô : le problème de départ, la promesse, ce que l'article couvre.
- Paragraphes de 2 à 4 lignes ; liste dès qu'une énumération dépasse trois éléments.
- Blocs mis en avant (callout, avertissement, `AffiliateInline`, tableau) : 3 à 5 par article. Au-delà, plus rien ne ressort.
- Pas de bloc d'affiliation dans l'intro : un produit se recommande après avoir été présenté dans son contexte.
- Tableau : 3 colonnes, 8 lignes au plus, la dernière porte l'avis de Pierre.
- FAQ (`FaqBlock`, qui émet le `FAQPage`) : 3 à 6 questions formulées comme le lecteur les poserait, réponses de 1 à 3 phrases.
- Liens internes dans le corps : 5 au plus, ancres descriptives. Mettre à jour les anciens articles pertinents pour pointer vers le nouveau.
- Pas de superlatif ni d'emphase, pas de gras à toutes les lignes, pas de conclusion qui répète l'intro.

### Écrire pour être cité (moteurs IA)

- Sous un H2 qui pose une question, la réponse complète en deux phrases, avant le développement.
- Étapes numérotées pour un "comment faire".
- Unités et chiffres explicites ("8 kWh par mois", "charge limitée à 80 %"), pas "une bonne économie".
- Le contexte dans la phrase ("avec Home Assistant", "sur une Redmi Pad SE") plutôt qu'un pronom qui renvoie au paragraphe précédent.

### Ce qu'on a le droit d'affirmer (E-E-A-T)

Trois origines, rien d'autre :

1. **L'installation réelle** : Home Assistant (MCP), historique, captures.
2. **Une source externe citée** : documentation Home Assistant, site du fabricant, texte officiel. Lien vérifié.
3. **Le vécu de Pierre**, quand il l'a dit : prix payé, ressenti, durée d'usage. Une phrase de vécu inventée est le pire défaut possible sur ce blog.

Tout chiffre porte sa source et sa période. En cas de doute sur un fait, on ne le publie pas.
Vigilance haute sur l'électricité (encastrement, 230 V, tableau), les batteries lithium et la sécurité (alarme, serrures) : aucune approximation, et renvoi vers un professionnel quand le geste dépasse le DIY.

### Technique

- Alt text descriptif sur chaque image, noms de fichiers explicites (`tablette-dashboard.jpg`, pas `IMG_1234.jpg`).
- `updatedDate` dans le frontmatter lors d'une mise à jour significative.
- Liens externes vérifiés (pas de 404). Jamais de `href="#"`.
- La version EN suit les mêmes règles, avec des requêtes et un `title` pensés en anglais.

## Git et déploiement

- Pas de branche ni de PR : on commite et on pousse directement sur `main` (décision de Pierre, comme sur Guibolles). Une PR ajoutait un build de preview, la revue Codex, l'attente du merge et un mail à chaque commentaire de bot.
- Tout push sur `main` déploie en production (build Vercel d'environ 20 s) : `npm run build` doit passer en local avant chaque push, et une modif visible se vérifie dans le rendu local (`npm run dev`) avant de pousser.
- Workflow : modifier, `npm run build`, vérifier, puis `git add <fichiers> && git commit -m "..." && git push origin main`. Si `main` a bougé entre-temps : `git pull --rebase origin main` avant de pousser.
- `vercel.json` porte `"github": {"silent": true}` : le bot Vercel ne commente plus les commits ni les PR (c'étaient des mails à chaque fois).
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
