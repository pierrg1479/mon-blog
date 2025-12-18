# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 💬 Activer les commentaires avec Giscus

Le site embarque une intégration [Giscus](https://giscus.app/) pour permettre aux lecteurs de publier des commentaires via les discussions GitHub. La section « Commentaires » est rendue par `src/components/Comments.astro`. Elle affiche le widget Giscus uniquement si les variables `PUBLIC_GISCUS_*` ci-dessous sont définies (un avertissement détaillant les variables manquantes n'apparaît qu'en environnement de développement). Par défaut, si les variables sont présentes, le message de fallback n'est plus rendu et le formulaire Giscus apparaît sous chaque article. Les valeurs sont lues telles quelles côté client : évitez les guillemets ou espaces superflus dans les fichiers `.env`.

### Variables requises

Créez un fichier `.env.local` à partir du modèle `.env.example` et remplissez les valeurs fournies par [giscus.app](https://giscus.app/). Toutes les variables sont préfixées par `PUBLIC_` pour être accessibles côté client dans Astro.

- `PUBLIC_GISCUS_REPO` : dépôt GitHub au format `owner/repo`.
- `PUBLIC_GISCUS_REPO_ID` : identifiant du dépôt (repo ID) affiché sur giscus.app.
- `PUBLIC_GISCUS_CATEGORY` : nom de la catégorie de discussions dédiée aux commentaires.
- `PUBLIC_GISCUS_CATEGORY_ID` : identifiant de la catégorie (category ID).

### Options configurables (défaut entre parenthèses)

- `PUBLIC_GISCUS_MAPPING` (`pathname`) : correspondance entre la page et la discussion.
- `PUBLIC_GISCUS_STRICT` (`1`) : active le mode strict.
- `PUBLIC_GISCUS_REACTIONS_ENABLED` (`1`) : active les réactions GitHub.
- `PUBLIC_GISCUS_EMIT_METADATA` (`0`) : envoie les métadonnées de la discussion.
- `PUBLIC_GISCUS_INPUT_POSITION` (`bottom`) : position de la zone de saisie.
- `PUBLIC_GISCUS_THEME` (`preferred_color_scheme`) : thème du widget.
- `PUBLIC_GISCUS_LANG` (`fr`) : langue du widget.

### Pré-requis GitHub / Giscus

- Le dépôt ciblé doit être **public** et les **Discussions** activées.
- L'application **giscus** doit être installée sur le dépôt : suivre les étapes sur [giscus.app](https://giscus.app/).
- Depuis le générateur giscus, recopiez `repo`, `repoId`, `category` et `categoryId` dans vos variables d'environnement. Ces informations apparaissent dans le code d'intégration proposé par le site.

### Déploiement Vercel

Ajoutez ces variables dans **Vercel → Project Settings → Environment Variables** (Production et Preview si nécessaire) :

- `PUBLIC_GISCUS_REPO`
- `PUBLIC_GISCUS_REPO_ID`
- `PUBLIC_GISCUS_CATEGORY`
- `PUBLIC_GISCUS_CATEGORY_ID`
- `PUBLIC_GISCUS_MAPPING`
- `PUBLIC_GISCUS_STRICT`
- `PUBLIC_GISCUS_REACTIONS_ENABLED`
- `PUBLIC_GISCUS_EMIT_METADATA`
- `PUBLIC_GISCUS_INPUT_POSITION`
- `PUBLIC_GISCUS_THEME`
- `PUBLIC_GISCUS_LANG`

Déployez à nouveau le projet après avoir ajouté ou modifié ces variables pour que Vercel expose les nouvelles valeurs au build. Pour un test local, exportez les variables dans `.env.local` puis lancez `npm run dev` ; le widget doit apparaître sous chaque article si la configuration est complète.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
