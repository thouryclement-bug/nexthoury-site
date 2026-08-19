# NexThoury — site freelance de Clément Thoury

Site vitrine statique (HTML/CSS/JS, sans framework ni build tool) pour NexThoury,
activité freelance de communication & publicité digitale (SEO, GEO, Ads, sites web,
content marketing, social media, webdesign, marketing digital, automatisation & IA).

## Emplacements des fichiers

- **Dossier de travail (source)** : `/Users/clementthoury/nexthoury-site/`
  C'est ici qu'il faut éditer les fichiers.
- **Miroir WordPress "Local"** : `/Users/clementthoury/Local Sites/nexthoury/app/public/preview/`
  Une copie du site est servie depuis ce sous-dossier `preview/` de l'installation WordPress
  locale (app "Local" by Flywheel), pour ne pas interférer avec l'install WP elle-même.
  URL locale : **http://nexthoury.local/preview/**
- **Après CHAQUE modification**, il faut resynchroniser le dossier source vers le miroir :
  ```bash
  cp -R "/Users/clementthoury/nexthoury-site/"* "/Users/clementthoury/Local Sites/nexthoury/app/public/preview/"
  ```
  Le site ne se met PAS à jour tout seul — cette étape est obligatoire à chaque session de travail.

## Stack technique

- HTML/CSS/JS vanilla, aucun framework, aucun build (pas de npm/vite/webpack).
- Un seul fichier CSS partagé : `styles.css` (~950 lignes) utilisé par toutes les pages "réelles".
- Un seul fichier JS partagé : `script.js` (dropdown menu, burger mobile, header au scroll,
  filtre projets, showcase pinné GSAP, carrousel témoignages, spotlight mousemove).
- **GSAP 3.12.5 + ScrollTrigger** chargés via CDN (cdnjs) sur `index.html` uniquement, pour
  l'animation de scroll épinglé (showcase des 9 compétences). Pas de dépendance npm à installer.
- **Cal.com** (réservation de créneaux, agenda Apple connecté côté Cal.com) intégré en iframe
  inline sur `index.html` et `contact.html` — voir section dédiée plus bas.
- Police : Plus Jakarta Sans (titres) + Inter (texte), chargées via Google Fonts.

## Page "concept" séparée (motion design)

`index-motion.html` + `motion.css` + `motion.js` forment une page d'accueil alternative,
totalement isolée du reste du site (classes préfixées `mx-`, police Outfit, palette différente),
créée comme démo de scroll storytelling façon Apple. Elle n'est PAS liée depuis la navigation
du vrai site — accessible seulement via son URL directe. Ne pas modifier `styles.css`/`script.js`
en pensant que ça affecte cette page : elle a son propre CSS/JS.

## Pages du site réel

Accueil (`index.html`), 9 pages "famille de compétence" (`seo.html`, `geo.html`, `ads.html`,
`site.html`, `content.html`, `social.html`, `webdesign.html`, `marketing.html`,
`automatisation.html`), 2 pages "sous-compétence" au design distinct
(`seo-audit-technique.html`, `ads-google-ads.html`), `projets.html` (liste), `projet-delmar.html`
(fiche projet), `contact.html`.

### Couleurs de marque par famille (`--family-color` inline sur `<body>`)

| Famille | Couleur |
|---|---|
| Agence SEO | `#3F76E8` (bleu) |
| Agence GEO | `#654321` (brun) |
| Ads — SEA & Social | `#7A2142` (bordeaux) |
| Création de site | `#0284C7` (bleu ciel) |
| Content Marketing | `#CBBD93` (sable — a aussi `--family-ink`/`--family-btn-text: #654321` pour le contraste) |
| Social Media | `#FFA500` (orange) |
| Webdesign | `#898989` (gris) |
| Marketing Digital | `#636B2F` (vert olive) |
| Automatisation & IA | `#7F00FF` (violet) |

Chaque page famille adapte automatiquement le header (glass transparent, PAS coloré),
le bouton Contact (coloré), le cercle photo du hero et le CTA final via ces variables CSS.
Les 2 pages "sous-compétence" (`service-page` sur le `<body>`) sont différentes : c'est TOUTE
la barre de menu qui prend la couleur, avec le bouton Contact inversé en blanc.

## Composants notables ajoutés récemment (à connaître avant de retoucher)

1. **Showcase pinné des 9 compétences** (accueil, section `#competences`) — scroll-jack GSAP
   façon Apple : l'image change en fondu pendant que le texte défile, épinglé en haut d'écran.
   Fallback mobile (<900px) : liste empilée normale, sans JS de pin.
   Logique JS dans `script.js` (cherche `showcasePin`), CSS dans `styles.css` (classes `.showcase-*`).
2. **Carrousel de témoignages** (accueil, section `.temoignages`) — 2 cartes "spotlight" (bordure
   qui suit la souris) avec flèches prev/next. Le nombre de cartes visibles s'adapte tout seul :
   ajouter un nouveau `.spotlight-card` dans `#testimonialTrack` suffit, les flèches s'activent
   automatiquement s'il y en a plus que ce qui peut s'afficher.
3. **Bloc "Comment je travaille"** (accueil + contact) — process en 4 étapes, carte `.bento-card`.
4. **Calendrier Cal.com intégré** — voir section dédiée ci-dessous.

## Intégration Cal.com (calendrier de disponibilité)

- Compte Cal.com connecté à l'agenda Apple/iCloud de Clément.
- Lien réel : **`clement-thoury/rendez-vous`** sur le domaine **cal.eu** (pas cal.com — c'est
  l'hébergement EU de Cal.com). Attention si vous cherchez à documenter/déboguer : le script
  embed et l'`origin` pointent vers `https://app.cal.eu` / `https://cal.eu`, PAS `cal.com`.
- Affiché en **inline** (calendrier visible directement dans la page, pas de popup) via
  `Cal("inline", { elementOrSelector: "#calInline", calLink: "clement-thoury/rendez-vous" })`,
  présent sur `index.html` (après la FAQ, avant le CTA final) et `contact.html` (tout en bas
  de page, juste avant le footer).
- Thème forcé en `"light"` avec `cssVarsPerTheme` (fond blanc, bords arrondis `12px`, couleur
  de marque `#0E2F7A`) — voir le script en bas de `index.html`/`contact.html`.
- En dessous du calendrier : `<p class="availability-next-slot">` avec le texte
  "Prochain créneau libre : semaine du 6 juillet." — **texte statique, à mettre à jour à la main**.
  Le rendre vraiment dynamique (lu depuis les disponibilités réelles) demanderait l'API Cal.com
  avec une clé API et une petite logique serveur — pas fait, le site étant 100% statique sans backend.

## Bandeau de cookies + politique de confidentialité

- **`confidentialite.html`** : page de politique de confidentialité (liée depuis le footer de
  toutes les pages réelles). Explique quelles données sont collectées (formulaire de contact,
  prise de RDV Cal.com) et sous quelles conditions les cookies publicité/analytics peuvent être
  utilisés (uniquement avec consentement explicite).
- **Bandeau + fenêtre de consentement** (injectés en JS par `script.js`, tout en bas du fichier,
  CSS dans `styles.css` sous "Cookie consent") : 3 choix au premier niveau — **Tout accepter**,
  **Tout refuser**, **Personnaliser**. Le bouton "Personnaliser" ouvre une fenêtre modale avec un
  interrupteur par catégorie (`Personnalisation des publicités`, `Données utilisateur pour la
  publicité`, `Stockage de publicité`, `Mesure d'audience`), plus un interrupteur "Tout cocher" et
  une ligne "Cookies essentiels" toujours activée/désactivable (calendrier Cal.com).
- Le choix est stocké dans `localStorage` (`nx-cookie-consent`) sous forme d'objet
  `{ad_personalization, ad_user_data, ad_storage, analytics_storage, savedAt}`. Tant qu'aucun choix
  n'a été fait, le bandeau se réaffiche à chaque visite.
- **Google Consent Mode v2** : les 4 catégories correspondent exactement aux signaux `ad_storage`,
  `ad_user_data`, `ad_personalization`, `analytics_storage` de Google. Le script appelle déjà
  `gtag('consent', 'default', {...tout 'denied'...})` au chargement et `gtag('consent', 'update', ...)`
  à chaque choix de l'utilisateur — donc le jour où un tag Google Ads / Google Analytics (gtag.js
  ou GTM) est ajouté au site, il respectera automatiquement ce consentement sans rien reconfigurer.
  Actuellement, **aucun tag Google Ads/Analytics n'est réellement chargé** sur le site : ce
  mécanisme n'est que la préparation en amont.
- Un lien **"Gérer les cookies"** (`data-cookie-settings`, footer de chaque page) permet de rouvrir
  la fenêtre de personnalisation à tout moment après le premier choix.
- Si un jour vous ajoutez un vrai tag Google Ads/Analytics, ne l'ajoutez PAS avant que le script de
  consentement (chargé via `script.js`) n'ait tourné, sinon les premiers événements partiraient
  sans attendre le `consent default`.

## Menu mobile "Compétences" — accordéon (pas de glisser horizontal)

- Le menu déroulé desktop (`.dropdown-panel`, 2 colonnes : familles à gauche, sous-compétences à
  droite) reste inchangé et ne s'affiche JAMAIS en mobile (`display:none` dans le bloc
  `@media (max-width:980px)`).
- En mobile, un bloc **séparé et dupliqué sur les 16 pages**, `.dropdown-mobile-accordion`
  (juste après `</div>` qui ferme `.dropdown-panel`, avant `</li>`), affiche les 9 familles sous
  forme d'accordéon vertical — exactement le même principe que `.faq-item`/`<details>` déjà
  utilisé pour la FAQ. Chaque `<details class="dropdown-mobile-item">` contient un lien "Voir la
  page X" en premier (mis en avant, `color:var(--navy)`) puis les sous-compétences. Tous les
  `<details>` partagent `name="mobile-competences-accordion"` (accordéon HTML natif exclusif : en
  ouvrir un ferme les autres — supporté nativement, aucun JS requis).
- Si vous ajoutez/renommez une famille ou une sous-compétence, il faut mettre à jour l'accordéon
  **sur les 16 pages** en plus du `.dropdown-panel` desktop (contenu dupliqué intentionnellement,
  pas de source unique — un script Python a servi à l'insertion initiale, voir git log).
- `.main-nav.is-mobile-open` garde un `max-height: calc(100vh - 110px); overflow-y: auto;` en
  filet de sécurité : le panneau est en `position:absolute` sur un header `sticky`, donc si son
  contenu dépasse la hauteur d'écran, la partie qui dépasse serait sinon inatteignable (voir piège
  ci-dessous).

## Showcase des 9 compétences (accueil) — carrousel mobile au lieu d'une liste empilée

- Desktop : scroll-jack GSAP inchangé (`showcasePin`, voir plus haut).
- Mobile (`≤980px`) : au lieu d'empiler les 9 blocs (obligeant à scroller longtemps pour tous les
  voir), un seul `.showcase-item` est affiché à la fois (même logique `.is-active` que le desktop),
  navigable via :
  - les flèches `#showcasePrev`/`#showcaseNext` (nouveau, dans `.showcase-controls` qui wrappe
    aussi les `.showcase-dots` existants) ;
  - un swipe tactile gauche/droite sur `#showcasePin` (seuil 40px) ;
  - un défilement automatique toutes les 4,5s (`setInterval`), qui se met en pause dès qu'on
    interagit manuellement (`restartAutoplay()`) et dès que la section sort du viewport
    (`IntersectionObserver`, seuil 0.4) pour ne pas tourner en arrière-plan inutilement.
  - Tout ceci réutilise `setActive()` déjà défini pour le pin desktop — aucune logique dupliquée.
- Le `-webkit-line-clamp` (2 lignes titre / 3 lignes description) n'a de sens que dans la boîte
  desktop à hauteur fixe : neutralisé en mobile (`unset` + `overflow:visible`) sinon le texte se
  fait couper au milieu d'un mot sans raison sur un item affiché plein écran.

## Pièges déjà rencontrés (pour ne pas les refaire)

- **Bug de cascade CSS majeur : le bloc `Responsive` était placé AVANT la section "Family
  (compétence) pages" dans le fichier.** Résultat : toutes les règles mobiles ciblant des classes
  `.family-*` (`.family-hero-inner`, `.family-hero-visual`, `.family-intro-inner`,
  `.family-subskills-grid`, padding de `.family-hero`) étaient silencieusement RÉÉCRASÉES par les
  règles de base de ces mêmes classes, qui apparaissaient PLUS BAS dans le fichier — à spécificité
  CSS égale, c'est l'ordre d'apparition dans le fichier qui tranche, peu importe qu'une règle soit
  dans un `@media` ou non. Autrement dit, plusieurs correctifs mobiles appliqués lors d'une session
  précédente (masquer l'image du hero compétence, passer la grille en 1 colonne, etc.) n'avaient
  JAMAIS réellement fonctionné. Corrigé en déplaçant toute la section "Family (compétence) pages"
  AVANT le bloc `Responsive` dans `styles.css`. **Règle à suivre à partir de maintenant : le bloc
  `Responsive` (et plus généralement toute media query globale en fin de fichier) doit TOUJOURS
  rester après les règles de base qu'il override.** Si vous ajoutez une nouvelle section de
  composant, insérez-la avant le bloc `Responsive`, jamais après — sinon ses futures règles mobiles
  spécifiques (si ajoutées dans cette section, hors du bloc Responsive global) resteront correctes,
  mais toute règle du bloc Responsive global la ciblant sera silencieusement ignorée.
- **`.family-breadcrumb` cassait le padding gauche/droite de `.container`** : les deux classes
  étaient posées sur le même `<div class="container family-breadcrumb">`, et
  `.family-breadcrumb{padding:18px 0 0}` (shorthand 3 valeurs = top/right&left/bottom) réécrivait
  TOUTES les valeurs de padding, y compris right/left à 0 — annulant le `padding:0 32px` de
  `.container` et collant le fil d'ariane au bord de l'écran sur les 11 pages compétence/service.
  Corrigé en remplaçant par la propriété longhand `padding-top:18px` uniquement. Piège général :
  ne JAMAIS redéclarer le raccourci `padding`/`margin` sur une classe destinée à être combinée avec
  `.container` — utiliser les propriétés longhand (`padding-top`, etc.) pour ne modifier qu'un
  côté.
- **Burger mobile mal aligné** : `.burger` n'avait pas de `margin-left:auto`, donc dès que
  `.main-nav`/`.btn-nav` passaient en `display:none` sous 980px, il se retrouvait collé au logo
  au lieu d'être poussé à droite du header. Corrigé avec `margin-left:auto` sur `.burger`.
- **Menu mobile illisible sur les pages "service"** (`ads-google-ads.html`,
  `seo-audit-technique.html`) : le texte du menu déroulé mobile restait en blanc (hérité de
  `body.service-page .dropdown-toggle{color:white}` pensé pour la barre colorée desktop) alors que
  le panneau mobile ouvert a un fond blanc — texte invisible. Idem pour les 3 barres du burger.
  Corrigé avec des overrides `body.service-page .main-nav.is-mobile-open ...{color:var(--ink)}`
  et `body.service-page .burger span{background:var(--white)}` (la barre de header, elle, reste
  colorée donc le burger doit y rester blanc quand le menu est FERMÉ).
- **Photo de profil affichée en premier sur mobile (accueil)** : `.hero-visual{order:-1}` faisait
  passer la photo de Clément AVANT le texte du hero sur mobile — jamais voulu. Retiré ; l'ordre DOM
  naturel (texte puis photo) s'applique maintenant à toutes les tailles d'écran pour `index.html`.
  Ne pas réintroduire un `order:-1` sur `.hero-visual`. (Les pages famille, elles, ont bien
  `.family-hero-visual{order:-1}` en mobile — mais ce sont des photos d'illustration du métier,
  pas son visage, donc pas concerné par cette règle.)
- **`.family-hero-inner` sans palier 980px** : contrairement à `.hero-inner` (accueil), le hero des
  9 pages famille restait en 2 colonnes jusqu'à 620px, avec un `.family-icon-circle` à largeur fixe
  (300px) → débordement horizontal réel entre ~621px et ~980px (tablettes). Corrigé en ajoutant
  `.family-hero-inner{grid-template-columns:1fr}` dès 980px et en passant `.family-icon-circle` en
  `width/height: clamp(220px, 28vw, 300px)` (donc jamais figé en dur).
- **Spécificité CSS cassant le responsive de `.family-subskills-grid.cols-3`** : la règle de base
  `.family-subskills-grid.cols-3{grid-template-columns:repeat(3,1fr)}` (2 classes) avait plus de
  spécificité que les overrides mobiles à 1 seule classe dans les media queries → elle gagnait à
  TOUTES les largeurs d'écran, y compris 320px. Si vous ajoutez une variante `.cols-N` à cette
  grille, pensez à dupliquer l'override dans les media queries avec le suffixe `.cols-N` inclus
  (voir les blocs `@media (max-width:980px)` et `@media (max-width:620px)`).
- **Deux blocs `@media (max-width:620px)` quasi identiques** existaient côte à côte (vestige d'un
  ajout rapide) — l'un écrasait silencieusement une partie de l'autre. Fusionnés en un seul bloc.
  Avant d'ajouter une nouvelle règle mobile, vérifiez qu'il n'existe pas déjà un bloc pour ce
  breakpoint plus bas dans le fichier.
- **Seuil desktop du showcase pinné désynchronisé du CSS** : `script.js` activait le pin GSAP dès
  `window.innerWidth >= 900`, alors que le CSS bascule en fallback mobile (liste empilée, sans pin)
  à `max-width:980px` — entre 900 et 980px, le JS pinnait un bloc que le CSS avait déjà démonté en
  liste longue, figeant le scroll sur une distance énorme. Corrigé : seuil JS aligné à `>= 981`.
  Si vous changez un breakpoint desktop/mobile d'un côté (CSS ou JS), pensez à répercuter l'autre.
- **Flèches du carrousel de témoignages en dehors du viewport mobile** : positionnées à `-23px` du
  bord de `.testimonial-carousel`, elles dépassaient légèrement (~3px) sous 620px où le padding du
  `.container` n'est que de 20px. Corrigé avec un offset réduit à `4px` en mobile + `overflow-x:
  hidden` de sécurité sur `.temoignages`.
- **`-webkit-line-clamp` sur le showcase pinné qui coupait le texte en fallback mobile** :
  `.showcase-item h3`/`p` ont un `-webkit-line-clamp` (2/3 lignes) nécessaire UNIQUEMENT dans la
  boîte pinnée desktop à hauteur fixe. Ces règles n'étaient pas neutralisées dans le fallback
  mobile (liste empilée sans contrainte de hauteur) → titres/descriptions longs tronqués sans
  raison sur mobile. Corrigé avec `-webkit-line-clamp: unset; overflow: visible;` dans le bloc
  `@media (max-width:980px)`. Si vous ajoutez un nouveau bloc avec line-clamp desktop, pensez à le
  neutraliser aussi en mobile s'il a un fallback en liste longue.
- **`.section`/`.hero`/`.family-hero` gardaient leur padding vertical desktop (96px/84px/96px) à
  toutes les tailles d'écran** → écarts énormes entre les blocs sur téléphone. Des paliers réduits
  ont été ajoutés à 980px (64px/56px/40px) et 620px (48px/40px/32px). Si vous ajoutez une nouvelle
  section pleine largeur avec un padding vertical important, pensez à lui donner un palier mobile.
- **Menu mobile "Compétences" : sous-compétences invisibles/inaccessibles**. Le panneau
  `.main-nav.is-mobile-open` est positionné en `absolute` par rapport au header `sticky` : si son
  contenu dépasse la hauteur visible de l'écran, la partie qui dépasse suit le header en scrollant
  (au lieu de rester dans le flux normal de la page) et devient impossible à atteindre — aucun
  scroll ne peut la révéler. Avec 9 familles empilées verticalement + le contenu de la
  sous-compétence active, ça dépassait systématiquement sur téléphone. Corrigé par :
  1. `.main-nav.is-mobile-open { max-height: calc(100vh - 110px); overflow-y: auto; }` en filet de
     sécurité (le panneau scrolle maintenant lui-même si besoin) ;
  2. Transformation de `.dropdown-families` en rangée horizontale scrollable de puces (au lieu
     d'une liste verticale de 9 lignes) sur mobile, ce qui libère assez de hauteur pour que la
     sous-compétence sélectionnée reste visible sans scroll dans la plupart des cas.
  Si vous ajoutez une 10e famille ou plus de sous-compétences par famille, réévaluez si le filet de
  sécurité (scroll interne) suffit toujours ou s'il faut retravailler la mise en page.
- **Bouton flottant "Me contacter" totalement masqué sur téléphone** (`display:none` sous 620px) :
  remplacé par une pastille compacte texte-seul ("Contact", via `::before` car le HTML contient
  `<span>Me contacter</span>` sur les 16 pages — pas la peine d'éditer le HTML, le pseudo-élément
  suffit) ancrée en bas à droite, pour garder un accès rapide au contact sur mobile plutôt que de
  le supprimer.
- **Photo/icône du hero des pages compétence retirée sur téléphone** (`.family-hero-visual`) :
  gardée entre 621-980px (où elle ne déforme plus rien grâce au `clamp()` sur `.family-icon-circle`
  et au palier 980px ajouté), mais complètement masquée sous 620px à la demande explicite — sur
  très petit écran, elle n'apportait pas assez de valeur pour justifier l'espace qu'elle prenait.
- **GSAP ticker figé** : sans `gsap.ticker.lagSmoothing(0)`, les animations au chargement peuvent
  se figer en cours de route dans certains contextes de rendu automatisé. Déjà réglé dans le code.
- **`<blockquote>` a une marge navigateur par défaut** (`16px 40px`) — si un jour un `.spotlight-card`
  ou toute carte basée sur `<blockquote>` a un espacement bizarre, c'est probablement ça
  (déjà corrigé avec `margin: 0` sur `.spotlight-card`).
- **Pin GSAP mal ancré** : si un bloc épinglé (`position: fixed` via ScrollTrigger) déborde de
  l'écran, vérifier que le `trigger` du `ScrollTrigger.create()` est bien le MÊME élément que celui
  qu'on épingle (`pin`), avec `start: "top top"` — sinon le pin se fige à une position décalée
  vers le bas (bug déjà rencontré et corrigé sur le showcase des compétences).
- Les cadres avec `overflow-x:hidden` uniquement au niveau des grandes sections empêchent que les
  "glow" décoratifs (dégradés flous en fond de page) soient coupés à mi-hauteur — les blobs
  décoratifs sont posés au niveau de la page (`position:absolute; top:0`), pas dans une section
  avec `overflow:hidden`.

## Convention de commande utile

Serveur de dev utilisé pendant les sessions précédentes (via l'outil de preview de Claude Code) :
```bash
python3 -m http.server 8765 --directory "/Users/clementthoury/nexthoury-site"
```
Mais pour tester "pour de vrai", ouvrir directement **http://nexthoury.local/preview/** dans un
navigateur (après avoir fait le `cp -R` de synchronisation ci-dessus).
