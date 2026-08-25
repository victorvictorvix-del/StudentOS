# Student OS — Contexte du projet

> Document de référence pour les deux démos (`desktop/` et `mobile/`). À lire avant toute modification.

## 1. Ce que c'est

**Student OS** est un concept d'"OS étudiant" : une application qui ne couvre pas seulement la scolarité (cours, notes, agenda) mais **toute la vie de l'étudiant** — argent, logement, administratif, transport, santé/habitudes, courses/repas — avec une couche d'intelligence transversale (**Student AI**) qui croise ces domaines pour donner des réponses contextualisées plutôt que des chiffres isolés.

Ce qui est livré ici est une **démo visuelle** :
- Pas de backend, pas de vraie authentification, pas de vraies connexions bancaires/API.
- Les écrans de connexion / onboarding sont non fonctionnels : ils mènent toujours au tableau de bord, sans validation réelle.
- Les données affichées sont **mockées** (voir `shared/js/data.js`), reprises des exemples de la spec produit.
- Les logos des services externes (banques, santé, transport, administratif, cloud/productivité) sont de **vrais logos/favicons** scrapés des sites officiels (Google Favicon service, DuckDuckGo Icons) ou servis par Simple Icons pour les grandes marques tech — voir `shared/js/logos.js`. (L'ancienne API `logo.clearbit.com` a été fermée par Clearbit/HubSpot et ne résout plus — ne pas la réutiliser.)

Deux déclinaisons volontairement séparées (fichiers HTML/CSS/JS indépendants) :
- `desktop/` — pensée PC / tablette / iPad (sidebar verticale, responsive : rail icônes seules sous 980px de large, `overflow-y:auto` sur la nav pour ne jamais couper d'item sur un écran bas).
- `mobile/` — pensée téléphone (dock flottant à 5 éléments).

Elles partagent uniquement la charte visuelle et les données (`shared/`), pas le code de layout.

## 2. Stack technique

HTML / CSS / JS **vanilla**, sans build ni dépendance npm — s'ouvre directement via XAMPP (`http://localhost/.../Student OS/desktop/index.html`). Choisi pour rester une démo légère, modifiable sans tooling.

- Police : Google Fonts (Inter par défaut ; Nunito/Lora/JetBrains Mono en alternative dans Paramètres) + Noto Sans SC/JP en repli automatique pour que le chinois/japonais s'affichent proprement quelle que soit la police choisie (ces polices latines n'ont pas de glyphes CJK).
- Icônes d'interface : SVG inline (pas de lib externe). Les icônes de nav/modules sont posées sur une tuile colorée par module (`navIconTile()` dans `views.js`) plutôt qu'en simple trait monochrome.
- Drapeaux de langue : vraies images (`flagcdn.com`), pas des emoji — l'emoji drapeau ne s'affiche pas de façon fiable sur toutes les configs Windows/navigateurs.
- Logos de marques/services : `cdn.simpleicons.org/{marque}` (grandes marques tech), `google.com/s2/favicons?domain=...` et `icons.duckduckgo.com/ip3/{domaine}.ico` en repli (banques/administratif/transport français) — voir `shared/js/logos.js`. Nécessite une connexion internet au chargement.
- Recherche d'établissement (onboarding) : vraie API publique `data.enseignementsup-recherche.gouv.fr` (dataset `fr-esr-principaux-etablissements-enseignement-superieur`, CORS ouvert, sans clé) — recherche en direct parmi les universités/écoles françaises réelles.
- Animations : CSS transitions/keyframes + `document.startViewTransition` (avec fallback) pour les changements de vue.

## 3. Structure

```
Student OS/
├── CONTEXT.md
├── shared/
│   ├── css/tokens.css    → palette (+ thème clair), typographie (+ polices alternatives), composants de base
│   ├── css/onboarding.css → styles de l'onboarding (partagés desktop + mobile)
│   ├── js/data.js        → toutes les données mockées, partagées desktop + mobile
│   ├── js/logos.js       → map service → URL de logo/favicon réel
│   ├── js/icons.js       → set d'icônes SVG inline
│   ├── js/i18n.js        → dictionnaire de traduction (10 langues) + thème/police (get/set + localStorage)
│   ├── js/views.js       → nav, rendu des vues, chat IA, tarifs, notes/carte mentale, drag & drop documents
│   └── js/onboarding.js  → logique des étapes d'onboarding
├── desktop/
│   ├── index.html       → onboarding démo (login → connecter services → confirmation)
│   ├── app.html         → shell SPA (sidebar + vues)
│   ├── css/desktop.css
│   └── js/desktop.js
└── mobile/
    ├── index.html       → onboarding démo (layout mobile)
    ├── app.html         → shell SPA (bottom bar + vues)
    ├── css/mobile.css
    └── js/mobile.js
```

## 4. Navigation

### Desktop (sidebar)
`Accueil · Études · Agenda · Inbox · Argent · Vie · Courses · Documents · Student AI · Connexions`

`Vie` est un hub avec 6 sous-onglets : **Argent, Logement, Administratif, Transport, Santé & habitudes, Courses & repas**. L'entrée "Argent" du menu principal affiche la même vue que "Vie > Argent" (pas de contenu dupliqué, juste deux points d'entrée).

### Mobile (dock flottant, 5 éléments fixes seulement)
`Accueil · Vie · [bouton + central] · Argent · Student AI`

Le dock est un **menu arrondi détaché du bord bas de l'écran** (glassmorphism, translucide), icônes seules (pas de libellé). L'élément actif est signalé par un petit carré translucide qui glisse derrière l'icône (`#dockIndicator`, positionné en JS dans `mobile/js/mobile.js`). Le bouton central "+" ouvre un overlay plein écran (grille de tous les modules avec logos) : c'est la seule porte d'accès aux modules absents du dock (Études, Agenda, Inbox, Documents, Connexions, sous-vues de Vie, Paramètres).

### Onboarding (5 étapes, `index.html`)
1. Connexion (démo, non fonctionnelle)
2. **Profil étudiant** — établissement (recherche live via l'API data.enseignementsup-recherche.gouv.fr, ~245 universités/écoles réelles), filière (12 choix), niveau : personnalise l'accueil (`applyProfilePersonalization()` dans `shared/js/views.js`, stocké en `localStorage` sous `studentos_profile`)
3. **Préférences d'affichage** — thème (clair/sombre), police, langue (drapeaux réels) : appliquées en direct pendant l'onboarding, reprises dans Paramètres
4. Connecter tes services (grille par catégorie, incl. Cours & productivité et Réductions étudiantes)
5. Confirmation → entrée dans l'app

### Paramètres (modale, accessible depuis la sidebar/le profil)
Profil, Notifications (démo), **Apparence** (clair/sombre, fonctionnel), **Police d'écriture** (Inter / Nunito / Lora / JetBrains Mono), **Langue** (10 langues avec drapeaux, traduit l'interface en direct), **Abonnement** (bouton vers les Tarifs), Comptes connectés, Déconnexion.

### Tarifs (`goTo('pricing')`, accessible depuis Paramètres ou le menu mobile)
4 formules avec bascule Annuel/Mensuel et stockage en Go explicite par palier : **Gratuit** 0€ (1 Go), **Essentiel** 19,99 €/an (10 Go), **Étudiant** 39,99 €/an (50 Go, mis en avant), **Premium** 79,99 €/an (200 Go). Les prix mensuels équivalents sont volontairement moins avantageux à l'année (ex. Essentiel 2,49 €/mois ≈ 29,88 €/an, soit ~33% plus cher que l'annuel). Voir `STUDENT_OS_DATA.pricing` dans `data.js`.

- **Bouton "i"** sur chaque formule → modale avec le descriptif complet (paragraphe détaillé par formule, `tier.description`).
- **Codes promo** de démo : `ETUDIANT10` (-10%) et `BIENVENUE20` (-20%), appliqués en direct sur les prix affichés.
- **Moyens de paiement** affichés (Visa, Mastercard, PayPal, Apple Pay, Google Pay) — logos réels, aucun paiement réel n'est effectué.
- **Un compte = une formule, multi-appareils** : bandeau explicite en haut de la page (`pricing.devicesNote`) précisant qu'un seul abonnement suffit pour se connecter depuis plusieurs appareils.

## 5. Modules — contenu de référence

| Module | Contenu clé (données mockées) |
|---|---|
| Accueil | Cartes résumé : budget du jour, prochain cours, tâche admin urgente, trajet du matin, sommeil de la nuit |
| Études | Emploi du temps, cours en cours, notes récentes, devoirs à rendre, **notes de cours synchronisées via Notion** |
| Agenda | Calendrier semaine, examen mis en avant (vendredi), **bandeau de synchronisation Google Calendar** |
| Inbox | Notifications (relances admin, alertes budget, messages université) |
| Argent | Reste à vivre 259€ · 421€/680€ dépensés · alerte dépassement ~34€ avant prochain versement · budget par catégorie (Loyer, Courses, Transport, Abonnements, Sorties, Autres) · abonnements suivis · objectif d'épargne · prévision de trésorerie |
| Vie > Logement | 410€/mois · charges 48€ · colocation 2 personnes · prochain prélèvement 1er septembre · documents logement |
| Vie > Administratif | Timeline « Cette semaine / Dans 18 jours / Mois prochain » : inscription, CAF, bourse, mutuelle, assurance habitation, carte transport |
| Vie > Transport | **Sélecteur de destination** (Université, Bibliothèque, Salle de sport, Retour domicile — aussi accessible depuis le bouton "+" mobile) qui recalcule le trajet affiché : durée, départ recommandé, ligne, perturbations, abonnement utilisé |
| Vie > Santé & habitudes | Sommeil 7h21 · pas 7421 (74% objectif) · concentration 3h10 · hydratation 1.4L/2L |
| Vie > Courses & repas | Budget restant 23€ · 4 repas réalisables (Pâtes/œufs, Riz cantonais, Soupe de lentilles, Omelette) · inventaire frigo/placards · liste de courses |
| Documents | Coffre-fort de documents + bandeau Google Drive (fichiers synchronisés, stockage utilisé) + **zone de glisser-déposer** (fichiers réels du poste, ou raccourcis Google Drive/Dropbox/iCloud qui ajoutent un fichier de démo) |
| Notes | Deux sous-onglets : **Notes** (création/édition de notes texte, persistées en `localStorage`) et **Carte mentale** (nœuds déplaçables à la souris/au doigt, liens SVG recalculés en direct, bouton "+" pour ajouter une idée) |
| Student AI | Deux modes : **Assistant IA** (chat avec suggestions, réponse croisée scriptée type Finance/Logement/Études/Agenda/Transport) et **Groupes** (groupes d'étude façon messagerie : liste de groupes, création, fil de discussion multi-expéditeurs, persistés en `localStorage`) |
| Connexions | Grille de services externes par catégorie (Banques, Santé, Transport, Administratif, Cours & productivité, **Réductions étudiantes** : UNiDAYS, Student Beans, Too Good To Go, Les Crous, ISIC) avec vrais logos/favicons, toggles visuels de démo |

## 6. Internationalisation (10 langues)

`shared/js/i18n.js` traduit **l'interface** (nav, titres de vues, boutons, paramètres, onboarding, tarifs, notes) en français, anglais, espagnol, allemand, italien, portugais, néerlandais, polonais, chinois et japonais, avec drapeau emoji par langue dans le sélecteur (Paramètres et onboarding, étape 3). Changement de langue = mise à jour immédiate sans rechargement (`refreshLanguage()`).

**Portée volontairement limitée** : les données mockées elles-mêmes (noms de cours, repas, montants, messages Student AI, noms de documents...) restent en français dans toutes les langues — seul le "chrome" de l'app est traduit. Traduire aussi le contenu multiplierait le volume par 10 pour un gain limité dans une démo ; à faire si le projet devient réel (les données viendraient alors d'une vraie base, pas de chaînes codées en dur).

## 7. Ce qui n'est PAS fait (volontairement)

- Aucune vraie authentification / session / stockage serveur (les préférences — thème, police, langue, profil, notes, carte mentale — sont en `localStorage`, donc locales au navigateur).
- Aucune vraie connexion bancaire, de santé ou de transport — tout est visuel.
- Aucun vrai modèle d'IA pour Student AI — réponse scriptée pour l'exemple donné.
- Aucun vrai paiement pour les Tarifs — les boutons "Choisir" ne débitent rien.
- Le glisser-déposer de documents n'envoie rien à un vrai Drive/Dropbox/iCloud — les fichiers ne font qu'apparaître dans la liste, localement.
- Pas de responsive "auto-partagé" entre desktop et mobile : ce sont deux apps distinctes par design.

## 8. Pour aller plus loin (hors scope démo)

Si le projet passe en version fonctionnelle : connecteurs bancaires réels (ex. agrégateurs type Budget Insight/Powens), API Apple Health / Google Fit, API transport (Île-de-France Mobilités, SNCF Connect, Citymapper), API CAF/Ameli si disponibles, vrai moteur IA côté serveur avec accès aux données croisées de l'utilisateur, vrai paiement (Stripe Billing pour les Tarifs), vraies API Google Drive/Dropbox/iCloud/Notion pour le glisser-déposer et les notes, traduction du contenu (pas seulement l'interface) si l'app sert un public réellement multilingue.
