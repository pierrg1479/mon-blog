// Pages qui ont une version index.md (articles FR et EN, matériel, à propos ; pas l'accueil).
// Lu par l'intégration qui écrit les .md et par BaseHead qui les déclare.
export const MARKDOWN_PAGES = [
	{ match: /^\/?(en\/)?blog\/[^/]+\/?$/, kind: 'article' },
	{ match: /^\/?(mon-materiel|en\/my-equipment)\/?$/, kind: 'equipment' },
	{ match: /^\/?(en\/)?about\/?$/, kind: 'about' },
];

/** Type de la page si elle a une version .md, sinon undefined */
export const markdownKind = (pathname) =>
	MARKDOWN_PAGES.find(({ match }) => match.test(pathname))?.kind;
