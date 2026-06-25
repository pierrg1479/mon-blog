---
title: 'Tablette murale Home Assistant : mon installation complète (Xiaomi + Fully Kiosk + support dédié)'
description: 'Comment j''ai transformé une Xiaomi Redmi Pad SE 11" en tableau de bord mural connecté avec Home Assistant et Fully Kiosk Browser, avec un câble USB encastré dans le mur et un support spécifique au modèle.'
pubDate: 'Jun 25 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

Depuis que j'ai Home Assistant, j'ai cherché un moyen d'avoir un point de contrôle central dans la maison, quelque chose de toujours visible, toujours disponible, sans avoir à sortir son téléphone. Une tablette murale s'est imposée comme la réponse évidente. Voici comment j'ai réalisé l'installation de A à Z.

## Le matériel

- **Tablette** : [Xiaomi Redmi Pad SE 11"](https://www.aliexpress.com) (8 Go / 256 Go), achetée 133,99 € sur AliExpress
- **Support mural** : [Route Lisi Designs](https://routelisidesigns.de), support spécifique Xiaomi Redmi Pad SE 11", 49,90 €
- **Alimentation** : câble USB-C encastré dans le mur
- **Logiciel** : [Fully Kiosk Browser](https://www.fully-kiosk.com/) (~6,90 € la licence par appareil)
- **Côté Home Assistant** : dashboard dédié créé dans l'interface HA

Pas de hub supplémentaire, pas d'intégration exotique. La tablette se connecte simplement au Wi-Fi de la maison et accède à Home Assistant via l'URL locale.

---

## Étape 1 : Choisir la tablette

La Xiaomi Redmi Pad SE 11 pouces est un excellent rapport qualité/prix pour cet usage :

- Écran 11 pouces → lisible à distance, confortable en tactile
- Processeur Snapdragon 680 → suffisant pour un dashboard HA, aucun lag
- Batterie 8000 mAh → même en charge permanente, la chaleur reste raisonnable
- Android standard → compatible Fully Kiosk sans restriction

Je l'ai achetée en 8 Go / 256 Go sur AliExpress pour 133,99 €. La version 128 Go suffit largement pour cet usage, mais la 256 Go n'était pas beaucoup plus chère à ce moment-là.

**Un point d'attention** : la charge en continu (24h/24) peut légèrement accélérer le vieillissement de la batterie. Fully Kiosk gère ça en limitant la charge à 80 % via un paramètre dédié. Je reviens dessus plus bas.

---

## Étape 2 : Le support mural

J'ai choisi un support spécifique au modèle plutôt qu'un support universel : le [Wandhalterung Xiaomi Redmi Pad SE 11" de Route Lisi Designs](https://routelisidesigns.de), un fabricant allemand qui propose des supports fabriqués sur commande pour différents modèles de tablettes.

**49,90 € pour un morceau de plastique, c'est clairement abusé.** Je ne vais pas faire semblant de trouver ça normal. Mais le résultat est là : le support est parfaitement ajusté au modèle, la tablette s'enclipse proprement et tient sans bouger. J'ai dû faire quelques petites modifications pour que ça rentre parfaitement dans ma configuration murale, mais rien de bloquant.

Si le budget est une contrainte, des alternatives existent sur [Printables](https://www.printables.com) ou [Thingiverse](https://www.thingiverse.com) : chercher "Xiaomi Redmi Pad SE 11 wall mount". Il faudra une imprimante 3D ou passer par un service d'impression à la demande.

---

## Étape 3 : Encastrer le câble USB dans le mur

C'est l'étape qui demande un peu de travail mais qui fait toute la différence visuellement. Zéro câble apparent = une installation qui ressemble à quelque chose de prévu dès la construction.

Dans mon cas, j'ai eu de la chance : j'avais **déjà un trou dans le mur** réalisé pour l'alimentation de mon écran de visiophone. J'ai profité de ce passage existant pour y glisser également le câble USB-C de la tablette. Résultat : aucune saignée supplémentaire, aucun perçage, câble totalement invisible.

Si vous partez de zéro :

1. Percer un trou derrière l'emplacement de la tablette
2. Faire passer un câble USB-C jusqu'à la prise électrique la plus proche (en passant sous plinthes ou dans une saignée)
3. Alimenter via une prise USB encastrée ou un chargeur dissimulé dans la boîte électrique

> **Variante rapide** : une goulotte peinte de la couleur du mur reste une option beaucoup plus simple et tout à fait acceptable visuellement.

Le câble USB-C ressort discrètement derrière le support et se branche dans la tablette avant de la clipser.

---

## Étape 4 : Installer et configurer Fully Kiosk Browser

Fully Kiosk est l'outil indispensable pour transformer une tablette Android en borne kiosque permanente. Il empêche l'utilisateur de sortir de l'application, gère le réveil automatique de l'écran et s'intègre nativement à Home Assistant.

L'application existe en version gratuite, mais elle est rapidement limitante : la détection de mouvement par caméra frontale et le serveur REST (qui permet à Home Assistant de piloter la tablette) sont des fonctionnalités réservées à la licence **Fully Kiosk PLUS**, à environ 6,90 €. Ce sont précisément les deux fonctionnalités qui font l'intérêt de cette installation. Sans elles, on a juste un navigateur verrouillé en plein écran. La licence est à vie et par appareil, ce qui reste raisonnable.

### Installation

1. Télécharger le fichier APK depuis [fully-kiosk.com/downloads](https://www.fully-kiosk.com/downloads/) directement sur la tablette (ou via ADB)
2. Activer "Sources inconnues" dans les paramètres Android si nécessaire
3. Installer l'APK et lancer Fully Kiosk

### Configuration essentielle

Dans **Paramètres → Kiosk Mode** :

- **Start URL** : `http://[IP_DE_TON_HA]:8123` (l'adresse locale de ton instance Home Assistant)
- **Kiosk Mode** : activé (empêche de quitter l'app)

Dans **Paramètres → Device Management** :

- **Keep Screen On** : activé
- **Screensaver / Screen Off** : régler le délai selon ta préférence (2 minutes d'inactivité → écran éteint fonctionne bien)

Dans **Paramètres → Remote Administration** :

- Activer le serveur REST local → permet à Home Assistant de piloter Fully Kiosk (allumer/éteindre l'écran, recharger la page, etc.)
- Noter l'IP et le port (ex. `http://[IP_TABLETTE]:2323`)

### Intégration dans Home Assistant

Ajouter l'intégration **Fully Kiosk Browser** depuis *Paramètres → Appareils & Services → Ajouter une intégration*. Rentrer l'IP de la tablette, le port (2323) et le mot de passe admin Fully Kiosk.

HA expose alors des entités pour allumer/éteindre l'écran, consulter le niveau de batterie, déclencher une alarme sonore, etc. Le capteur de niveau de batterie est la pièce centrale de l'étape suivante.

![Contrôles Fully Kiosk dans Home Assistant, Screen et Screensaver](/images/tablette-murale/ha-fully-kiosk-controles.jpg)

---

## Étape 4b : Préserver la batterie avec une prise connectée

Une tablette n'est pas conçue pour rester branchée en permanence. Laisser la batterie à 100 % en charge continue dégrade irrémédiablement les cellules sur le long terme. En quelques mois, l'autonomie peut chuter significativement.

La solution logicielle (limiter la charge à 80 % dans Fully Kiosk) ne suffit pas : elle empêche la batterie de dépasser 80 %, mais le chargeur reste branché en continu, ce qui génère de la chaleur et du stress pour les cellules.

J'ai opté pour une approche plus propre : une **prise connectée Sonoff Zigbee S60ZBTPF** couplée à une automatisation Home Assistant qui coupe physiquement l'alimentation quand la batterie est suffisamment chargée, et la rétablit quand elle redescend trop bas. La batterie oscille entre 30 % et 85 %, sans jamais être stressée aux extrêmes.

<!-- PRODUCT_CARD: Prise connectée Zigbee Sonoff S60ZBTPF | 16€ | ⭐⭐⭐⭐⭐ | Taille parfaite et fiable. -->

### Les automatisations

J'ai créé deux automatisations distinctes, plus lisibles à maintenir qu'une seule avec une logique de choix.

![Automatisations batterie tablette dans Home Assistant](/images/tablette-murale/ha-automations-batterie.jpg)

**Tablette Couloir – Démarrer charge** : allume la prise dès que la batterie passe sous 30 %. Une condition évite de rallumer la prise si elle est déjà active.

```yaml
alias: Tablette Couloir - Démarrer charge
description: Active la prise tablette si la batterie passe sous 30%
triggers:
  - trigger: numeric_state
    entity_id: sensor.tablette_battery_level
    below: 30
conditions:
  - condition: state
    entity_id: switch.prise_tablette
    state: "off"
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.prise_tablette
mode: single
```

**Tablette Couloir – Arrêter charge** : coupe la prise dès que la batterie dépasse 85 %. Même logique : une condition vérifie que la prise est bien allumée avant de l'éteindre.

```yaml
alias: Tablette Couloir - Arrêter charge
description: Coupe la prise tablette si la batterie dépasse 85%
triggers:
  - trigger: numeric_state
    entity_id: sensor.tablette_battery_level
    above: 84
conditions:
  - condition: state
    entity_id: switch.prise_tablette
    state: "on"
actions:
  - action: switch.turn_off
    target:
      entity_id: switch.prise_tablette
mode: single
```

> `sensor.tablette_battery_level` est le capteur de batterie exposé par l'intégration Fully Kiosk. `switch.prise_tablette` est la prise Sonoff Zigbee dans le couloir.

---

## Étape 5 : Réveil automatique à l'approche

C'est la fonctionnalité qui rend l'installation vraiment agréable au quotidien : l'écran est éteint au repos et s'allume automatiquement quand on s'en approche. Et le mieux, c'est qu'on n'a besoin d'**aucun capteur externe**. Fully Kiosk utilise directement la **caméra frontale** de la tablette pour détecter le mouvement.

### Activer la détection de mouvement dans Fully Kiosk

Dans **Paramètres → Motion Detection** :

- **Enable Motion Detection** : activé
- **Turn Screen On on Motion** : activé
- **Motion Sensitivity** : à ajuster selon l'environnement (commencer à 50 %)
- **Turn Screen Off After (seconds)** : 60 secondes dans ma configuration

Fully Kiosk analyse le flux de la caméra frontale en local pour détecter un changement dans l'image. Aucune donnée n'est envoyée à l'extérieur. L'écran s'allume en moins d'une seconde.

Une fois configuré, ces paramètres sont aussi visibles et pilotables directement depuis la fiche de l'appareil dans Home Assistant :

![Configuration Fully Kiosk dans Home Assistant, Motion detection activé, Screen off timer à 60s](/images/tablette-murale/ha-fully-kiosk-configuration.jpg)

Au-delà du confort, cette détection anticipée a un vrai avantage pratique : elle donne quelques secondes à la tablette pour charger le contenu avant que vous soyez devant. Les flux caméras notamment ont un petit lag au démarrage, et le fait que l'écran soit déjà allumé quand vous arrivez fait une vraie différence.

J'avais d'abord testé une autre approche : un double appui sur l'écran pour l'allumer. C'était simple à mettre en place mais pas du tout satisfaisant en termes de réactivité. On se retrouvait à tapoter l'écran, attendre, retapoter. La détection par caméra frontale règle complètement ce problème.

> **Note pratique** : la sensibilité est à calibrer selon l'éclairage ambiant. En conditions sombres, la caméra est moins réactive. On peut monter la sensibilité ou opter pour une luminosité de veille très basse plutôt qu'un écran totalement éteint.

---

## Étape 6 : Le dashboard Home Assistant

J'ai créé deux dashboards dans Home Assistant : un pour la tablette murale, un pour le mobile. Le dashboard tablette est organisé en 5 vues accessibles par onglets.

**Vue Accueil** : la vue principale, celle qu'on voit en passant devant. En haut, une barre de chips affiche en permanence l'heure, le mode maison actif, la météo locale, la température du salon, l'indice de qualité de l'air, la vitesse du vent et les horaires de lever/coucher du soleil. En dessous : la présence des membres du foyer, le sélecteur de mode maison, l'alarme Somfy, les volets (salon, cuisine, entrée), les prévisions météo sur plusieurs jours, un aperçu caméra de la rue, les commandes portail et porte de garage, les serrures entrée et porte de service, et enfin un bloc poubelles qui rappelle les prochaines collectes (ordures, recyclage, déchets verts, encombrants).

**Vue Sécurité** : dédiée à la surveillance. En chips : statut alarme, état des caméras (mode privé ou non), portail, portes, fenêtres. Les flux complets de six caméras sont accessibles directement : rue, terrasse, garage, porte de service, entrée, salon. Les modes alarme (absent, nuit, désactiver) sont accessibles en un appui.

**Vue Chauffage** : pilotage Tado pièce par pièce. Espace jour (salon, salle à manger, cuisine, bureau) et espace nuit (chambres), plus les sèche-serviettes RDC et étage. Les chips affichent en temps réel la température extérieure, intérieure, le nombre de zones en chauffe et les fenêtres ouvertes.

**Vue Musique** : contrôle Spotify et ampli NAD, avec des raccourcis vers les playlists fréquentes.

**Vue Divers** : robots aspirateurs (avec carte de plan pour chaque étage), robot tondeuse, électroménager (sèche-linge, lave-linge, lave-vaisselle), éclairages extérieurs, et un bloc bureau/garage pour l'humidité, le déshumidificateur et le chargeur vélo.

> **Sur la mise en page** : le format tablette murale impose des cartes larges et des boutons généreux. Tout doit être lisible et cliquable à environ 1,5 m de distance.

---

## Ce que j'aurais voulu faire : la tablette comme visiophone

Avant de me lancer, j'avais une idée en tête : utiliser cette tablette comme **visiophone**. L'idée était de passer par un interphone Reolink compatible Home Assistant : quand quelqu'un sonne, la tablette affiche automatiquement le flux de la caméra de la porte et permet de parler à la personne.

Sauf que ça ne fonctionne pas. Et pas parce que HA ne sait pas le faire techniquement, mais parce qu'**aucun interphone sur le marché ne propose de mode bidirectionnel natif via Home Assistant**. On peut recevoir le flux vidéo, voir la personne, mais pour parler il faut sortir son téléphone et ouvrir l'app dédiée. Exactement ce qu'on voulait éviter.

Il existe quelques bricolages pour contourner ça : des solutions à base de WebRTC, de proxies, d'intégrations maison. C'est une vraie usine à gaz. Et pour quelque chose d'aussi sensible qu'un interphone (ça doit fonctionner à chaque fois, sans réfléchir), une solution fragile n'est pas envisageable. J'ai abandonné l'idée et la tablette reste ce qu'elle fait très bien : un dashboard de contrôle.

C'est une vraie lacune du marché. Si quelqu'un trouve une solution propre un jour, je suis preneur.

---

## Une tablette murale pour piloter une maison connectée ?

Mon avis honnête : **non, ce n'est pas indispensable.** J'ai vécu sans pendant longtemps et la maison fonctionnait très bien.

La meilleure automatisation, c'est celle qui ne nécessite aucune intervention. Quand les volets s'ouvrent tout seuls au lever du soleil, quand l'alarme se désactive en détectant mon téléphone qui rentre, quand l'éclairage s'adapte sans que j'aie à toucher quoi que ce soit. C'est ça l'objectif. Devoir appuyer sur une tablette ou sortir son téléphone pour déclencher quelque chose, c'est finalement ajouter une couche de charge mentale là où on voulait en enlever.

**Alors pourquoi j'en ai quand même une ?**

Parce que certains cas d'usage sont vraiment bien résolus par une tablette fixe et toujours visible :

- **Positionnée à côté de l'interphone**, elle permet d'ouvrir le portail, de déverrouiller la porte de garage et d'actionner la serrure d'entrée d'un seul appui, sans chercher son téléphone
- **Le matin en passant devant**, un coup d'œil suffit pour voir la météo du jour et les températures intérieures. Pas besoin de sortir le téléphone, l'info est là
- **Quand des invités sont à la maison en mon absence**, la tablette leur donne une autonomie complète : ouvrir les volets, contrôler ce dont ils ont besoin sans avoir à m'appeler ou à installer une application

Ce n'est pas le cœur de l'installation domotique, c'est un complément pratique pour les situations où l'automatisation complète n'est pas possible ou pas pertinente. Et franchement, je trouve ça cool.

---

## Le résultat

L'installation tourne depuis plusieurs semaines sans le moindre problème. La tablette s'allume quand on passe devant, affiche ce qu'on a besoin de voir, et s'éteint toute seule. Le câble encastré donne un rendu propre. Le support tient parfaitement.

Cette installation marque pour moi un vrai tournant : pour la première fois, j'ai l'impression que ma domotique est **fiable et aboutie**. Je sais que c'est illusoire : une installation Home Assistant n'est jamais vraiment terminée et ne le sera jamais 😅. Mais avoir un point de contrôle physique, permanent, intégré dans le mur... ça change quelque chose dans la façon de percevoir l'ensemble du système.

**Coût total** :

| Élément | Prix |
|---|---|
| Xiaomi Redmi Pad SE 11" (8 Go / 256 Go) | 133,99 € (AliExpress) |
| Support Route Lisi Designs | 49,90 € + 6,99 € de port |
| Fully Kiosk Browser (licence) | ~7 € |
| Câble USB-C + accessoires | ~10 € |
| **Total** | **~208 €** |

Le support représente 28 % du budget total pour un morceau de plastique. C'est le seul vrai bémol de cette installation. Mais pour quelque chose qui reste vissé dans le mur pour des années, j'ai préféré un ajustement parfait à une solution approximative.

---

## Liens utiles

- [Fully Kiosk Browser](https://www.fully-kiosk.com/) : documentation complète et téléchargement
- [Route Lisi Designs](https://routelisidesigns.de) : supports muraux spécifiques par modèle de tablette
- Intégration HA : chercher "Fully Kiosk Browser" dans les intégrations officielles Home Assistant

---

*Tu as des questions sur l'installation ? Les commentaires sont ouverts ci-dessous.*
