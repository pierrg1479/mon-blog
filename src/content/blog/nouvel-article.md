---
title: 'Guide complet de la syntaxe Markdown'
description: 'Exemple de toutes les possibilités de formatage Markdown disponibles'
pubDate: 'Dec 17 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

Cet article présente l'ensemble de la syntaxe Markdown de base ainsi que des extensions courantes.

## Titres

# H1
## H2
### H3
#### H4
##### H5
###### H6

## Paragraphes

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur?

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Citations

> La citation est un élément important dans la rédaction d'articles.
>
> — Citation avec auteur

## Listes

### Liste non ordonnée

* Item 1
* Item 2
* Item 3
  * Sous-item 3.1
  * Sous-item 3.2

### Liste ordonnée

1. Premier item
2. Deuxième item
3. Troisième item
   1. Sous-item 3.1
   2. Sous-item 3.2

### Liste de tâches

- [x] Tâche complétée
- [ ] Tâche en cours
- [ ] Tâche à faire

## Code

### Code inline

Voici du `code inline` dans une phrase.

### Bloc de code
```
Code sans coloration syntaxique
```

### Code avec coloration syntaxique
```javascript
function exemple() {
  console.log("Hello World!");
  return true;
}
```
```python
def bonjour():
    print("Bonjour le monde!")
    return True
```
```yaml
# Configuration Home Assistant
automation:
  - alias: "Test"
    trigger:
      platform: state
      entity_id: binary_sensor.motion
```

## Tableaux

| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
| Ligne 1   | Donnée A  | Donnée 1  |
| Ligne 2   | Donnée B  | Donnée 2  |
| Ligne 3   | Donnée C  | Donnée 3  |

## Mise en forme du texte

**Texte en gras**

*Texte en italique*

***Texte en gras et italique***

~~Texte barré~~

## Liens

[Lien vers Google](https://www.google.com)

[Lien avec titre](https://www.google.com "Titre du lien")

## Images

![Texte alternatif](../../assets/blog-placeholder-1.jpg)

## Ligne horizontale

---

## Notes de bas de page

Voici une phrase avec une note de bas de page[^1].

[^1]: Ceci est la note de bas de page.

## Emoji

:smile: :rocket: :house: :bulb:

## Abréviations

HTML et CSS sont des langages web.

*[HTML]: Hypertext Markup Language
*[CSS]: Cascading Style Sheets

## Définitions

Terme 1
: Définition du terme 1

Terme 2
: Définition du terme 2
: Autre définition du terme 2

## Échappement de caractères

\*Ce texte n'est pas en italique\*

\[Ce texte n'est pas un lien\]
