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

## Cache-busting de `styles.css` / `script.js` (IMPORTANT, à faire à CHAQUE modif de ces 2 fichiers)

Le client a signalé plusieurs fois "j'ai rechargé mais rien n'a bougé" alors que le déploiement
GitHub Pages était pourtant correct (vérifié via `curl` en contournant tout cache) — le vrai
problème : `styles.css`/`script.js` sont mis en cache par le navigateur/CDN **indépendamment** de
la page HTML qui les charge. Rajouter `?v=N` sur l'URL de la PAGE (ex: `index.html?v=3`) ne force
PAS le rechargement de ces deux fichiers, puisqu'ils sont réclamés via leur URL propre
(`styles.css`, `script.js`) sans paramètre — ça ne suffit pas.

**Solution mise en place** : toutes les balises `<link rel="stylesheet" href="styles.css?v=4">` et
`<script src="script.js?v=4">` sur les 16 pages portent un paramètre de version. **Après chaque
modif de `styles.css` OU `script.js`, il faut incrémenter ce numéro sur les 16 pages** (sinon les
visiteurs qui ont déjà chargé le site continueront de voir l'ancienne version pendant tout le
`cache-control: max-age=600` de GitHub Pages, voire plus longtemps côté navigateur mobile) :
```bash
cd /Users/clementthoury/nexthoury-site
sed -i '' 's/styles\.css?v=[0-9]*/styles.css?v=5/; s/script\.js?v=[0-9]*/script.js?v=5/' *.html
```
(remplacer `5` par le nouveau numéro à chaque fois — juste incrémenter le précédent).

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
(fiche projet), `contact.html`, `apropos.html` (bio de Clément), `confidentialite.html`.

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
3. **Bloc "Comment je travaille"** (accueil + contact + apropos) — process en 4 étapes, carte `.bento-card`.
4. **Calendrier Cal.com intégré** — voir section dédiée ci-dessous.
5. **Intro cinématique** (accueil, tout en haut, `.intro-reveal`) — voir section dédiée ci-dessous.
6. **Bloc "À propos" compact** (accueil, juste avant le CTA final, `.about-teaser`) — petite carte
   avec photo ronde + titre + sous-titre, cliquable, envoie vers `apropos.html`. Volontairement
   discret : Clément ne veut PAS d'une grande photo de lui en évidence sur l'accueil (préférence
   explicite) — ne pas réintroduire de portrait en grand format dans le hero.

## Intro cinématique (accueil, avant le hero classique)

Référence de design explicite du client : template ["Solaris" de Lovable](https://lovable.dev/fr/templates/websites/music/solaris-dj-music-artist-website-template)
— grande photo plein écran, menu translucide flottant dessus, nom en très grand qui vient
border-à-border en bas de l'image.

- **Photo de fond : `assets/intro-bg.jpg`** (photo de vagues bleu marine, PAS un portrait de
  Clément — préférence explicite de ne pas afficher son visage en grand sur l'accueil). Appliquée
  sur `.intro-reveal` via `background-image` en deux couches : un `linear-gradient` sombre
  semi-transparent (plus opaque en haut ~0.65 et en bas ~0.55, plus clair au milieu ~0.45) PAR-DESSUS
  `url('assets/intro-bg.jpg')`, avec `background-size:cover; background-position:center;` — le
  dégradé garantit que le texte blanc (kicker + nom) reste lisible quel que soit le contenu de la
  photo. Les anciens `.intro-glow` (blobs flous colorés, pensés pour le dégradé de substitution)
  ont été retirés du HTML et du CSS : ils n'avaient plus de sens par-dessus une vraie photo. Si
  Clément fournit une autre photo plus tard, il suffit de remplacer `assets/intro-bg.jpg` (même nom
  de fichier) ou de changer l'URL dans la règle `.intro-reveal` de `styles.css`.
- **Plein écran, sous le header** : `.intro-reveal` a un `margin-top:-86px` (= hauteur du header
  `.site-header`, sticky) pour remonter SOUS le header et lui laisser flotter dessus (`z-index:100`
  sur le header le garde visuellement au-dessus). `min-height:100vh`. Si vous changez la hauteur du
  header (`.site-header` padding ou `.header-inner` height), il faut recalculer ce `-86px`.
- **Menu translucide sombre pendant l'intro** : classe `.header-on-dark` posée/retirée sur
  `#site-header` par un `IntersectionObserver` dans `script.js` (observe `#intro`, seuil 0.35) —
  fond du header semi-transparent sombre (`rgba(20,22,30,0.55)`), texte blanc, bouton Contact
  inversé en blanc, logo swappé vers `assets/logo-wordmark-white.png` (via `id="headerLogo"`,
  remis à `logo-wordmark.png` dès qu'on quitte l'intro). Ce mécanisme est scopé strictement à
  `index.html` (seule page avec `#intro`) — aucune autre page n'est affectée.
- Contenu : `.intro-top` (padding-top ~132px pour laisser la place au header) contient
  `.intro-kicker` (petit texte "Freelance — communication & publicité digitale") — **visible
  immédiatement au chargement**, pas d'animation dessus. `.intro-center` (position absolute,
  `inset:0`, `display:flex` centré horizontalement ET verticalement) contient `.intro-name`
  affichant « Clément Thoury » **sur une seule ligne** (`white-space:nowrap`,
  `clamp(34px, 9.5vw, 150px)`), **au milieu de la section, pas en bas**. Les deux sont des `<p>`,
  PAS des `<h1>`/`<h2>` — le vrai `<h1>` de la page reste "Votre communication, enfin orientée
  résultats." dans `.hero` juste en dessous, pour garder une seule vraie balise `<h1>` par page.
- **Historique des allers-retours sur l'animation du nom** (pour ne pas la refaire dans le mauvais
  sens si on retouche cette section) : v1 = révélation au chargement (GSAP timeline, translateY).
  v2 = révélation liée au scroll, progressive (translateY + opacity mappés sur `window.scrollY`).
  v3 = révélation au premier mouvement de souris (`mousemove` sur `#intro`), avec fallback
  `setTimeout` sur mobile/tactile. **v4, version actuelle** : reprend le déclencheur scroll de la
  v2, mais garde le fondu simple sans mouvement de la v3 — un seul écouteur
  `window.addEventListener('scroll', revealIntroName, { once: true, passive: true })` ajoute la
  classe `.is-revealed` (qui bascule `opacity:0→1` via `transition: opacity 1s ease`, définie sur
  `.intro-name`) dès le tout premier pixel de scroll, sur n'importe quel appareil (souris, tactile,
  clavier) — pas de distinction tactile/souris nécessaire puisque scroller fonctionne pareil
  partout. Le kicker et `.intro-scroll-cue`, eux, sont TOUJOURS visibles dès le chargement — seul
  le nom est concerné par ce mécanisme de révélation.
- `.intro-scroll-cue` : petit indicateur "Scroll" en bas de l'intro avec un point qui rebondit
  (`@keyframes introScrollDot`), pur CSS, toujours visible, positionné en `absolute`.
- **`.intro-name` en majuscules** (`text-transform:uppercase`, demande explicite du client, cf.
  capture de référence). Le texte HTML reste `Clément Thoury` (casse normale, pour
  l'accessibilité/lecteurs d'écran) — seul le RENDU visuel est en capitales via CSS, ne changez pas
  le texte source. Les majuscules étant plus larges que la casse mixte, le plancher du `clamp()` a
  été abaissé (`clamp(28px, 9vw, 150px)`, `letter-spacing:-0.015em`) pour garder une marge de
  sécurité sur les très petits écrans (≤340px) où le texte est en `white-space:nowrap` — testé par
  calcul de métriques de police réelles (Plus Jakarta Sans ExtraBold), marge confortable retrouvée.
  Si vous changez un jour ce texte pour quelque chose de plus long, revérifiez cette marge.
- **Bug corrigé : menu mobile illisible (blanc sur blanc) si on ouvre le burger pendant l'intro.**
  Même piège que celui déjà corrigé pour `body.service-page` (voir plus bas) : `header-on-dark`
  passe le texte du header en blanc, mais le panneau mobile déplié (`.main-nav.is-mobile-open`)
  garde un fond blanc — sans override, le texte y devient illisible. Fix : règles symétriques
  `.site-header.header-on-dark .main-nav.is-mobile-open ...{color:var(--ink)}` dans le bloc
  Responsive, juste après l'équivalent `body.service-page`. **Piège général à retenir** : chaque
  fois qu'une nouvelle condition met le texte du header en blanc (nouvelle page colorée, nouvel
  état comme `header-on-dark`), il faut AUSSI ajouter l'override symétrique pour le panneau mobile
  ouvert (qui reste toujours blanc, lui) — sinon le même bug réapparaît à chaque nouveau cas.
- Le hero classique juste en dessous n'a plus de photo (`.hero-visual` supprimé du HTML et de son
  CSS) : `.hero-inner` est maintenant en une seule colonne centrée (`max-width:760px; margin:0
  auto; text-align:center;`). La pastille "Disponible pour un nouveau projet" (ex-badge flottant
  sur la photo) est maintenant un pill `.hero-available` au-dessus de l'eyebrow.

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

## Popup "9 expertises" (accueil uniquement)

- Référence de design explicite du client : un popup e-commerce façon carte "verre" translucide
  (glassmorphism — fond flou/semi-transparent, `backdrop-filter`), avec tag + puce verte, liste de
  points à puces, question + boutons pilules à choix, CTA final. Voir capture fournie (site de
  vêtements "Scuffers", popup newsletter "10% off your first order").
- **Généré entièrement en JS** (`script.js`, tout en bas du fichier, cherche `expertise-popup`),
  injecté dans `document.body` — PAS écrit en HTML statique. Le script est chargé sur les 16 pages
  mais se désactive lui-même (`return` immédiat) si `#competences` n'existe pas sur la page — donc
  ne s'affiche QUE sur `index.html` (seule page avec cette section). Pas besoin de dupliquer/gérer
  ce composant ailleurs.
- **Déclencheur** : `IntersectionObserver` sur `#competences` (la section des 9 compétences) —
  se déclenche quand la section est quittée PAR LE BAS (`!entry.isIntersecting &&
  entry.boundingClientRect.top < 0`), c'est-à-dire une fois que le visiteur a scrollé au-delà,
  pas avant de l'atteindre. Correspond à la demande explicite : "une fois qu'ils ont pris
  connaissance des 9 expertises".
- **Ne se réaffiche plus une fois fermé** : `localStorage` (`nx-expertise-popup-shown`), posé à la
  fermeture (bouton X, clic hors de la carte, touche Échap) OU au clic sur une pilule/le CTA final
  (considéré comme une conversion, pas la peine de re-déranger). Pas d'expiration dans le temps —
  si vous voulez le refaire apparaître périodiquement (ex. après 30 jours), stocker un timestamp
  au lieu d'un simple flag et comparer à `Date.now()`.
- **Historique** : une v2 avait ajouté un calendrier Cal.com intégré (2e instance inline,
  `#calInlinePopup`) + une liste de 3 points à puces + un mockup téléphone dessiné en CSS pur.
  **Le client a demandé de retirer le calendrier** ("ça ne tient pas sur un popup classique") et de
  raccourcir fortement le texte — retour à un simple bouton vers `contact.html`. Ne PAS réintroduire
  le calendrier inline sans qu'on le redemande explicitement.
- **Contenu actuel (v3), volontairement très court** :
  - Tag "Vous avez vu ce que je sais faire" + titre "Allez plus loin, ou réservez déjà un
    créneau." — **texte fixe, ne pas reformuler** (validé explicitement par le client).
  - Une seule phrase : "20 minutes suffisent pour poser les bases de votre projet, sans
    engagement." (citation exacte du client — ne pas l'étoffer).
  - 4 pilules cliquables SEULEMENT : Ads, Création de site, Automatisation & IA, Voir les 9
    compétences (`index.html#competences`) — la pilule "Agence SEO" a été retirée à la demande du
    client (les 3 pilules + "voir les 9 compétences" suffisent).
  - Un seul CTA : "Prendre rendez-vous" → `contact.html` (pas de capture d'email : site 100%
    statique, pas de backend pour ça).
- **Verre encore plus translucide** (2e demande du client dans ce sens) : fond
  `rgba(255,255,255,0.2)` (contre `0.38` puis `0.72` aux étapes précédentes) avec `backdrop-filter:
  blur(30px) saturate(170%)`. Si on retouche encore la translucidité, c'est cette valeur alpha
  qu'il faut ajuster — plus bas = plus transparent. `overflow: hidden auto` sur `.expertise-popup`
  (au lieu de `overflow-y: auto` seul) pour éviter tout débordement horizontal causé par le mockup
  téléphone incliné (voir ci-dessous) sans empêcher le scroll vertical si le contenu dépasse.
- **Mockup téléphone = vraie image de cadre iPhone**, pas du CSS dessiné à la main. Fichier fourni
  par le client : `assets/phone-frame.png` (mockup "iPhone 17" téléchargé par le client). **Point
  technique important** : ce PNG a sa zone "écran" en **transparence alpha réelle** (vérifié
  pixel par pixel avec Pillow — pas juste blanc visuellement), ce qui permet de poser le contenu
  DERRIÈRE l'image du cadre (z-index inférieur) et de voir le cadre (aluminium + bezel + îlot
  caméra) se superposer proprement par-dessus. Zone d'écran mesurée dans le PNG source (388×800px) :
  insets `top≈1.9%, bottom≈1.9%, left≈4.6%, right≈4.6%` — c'est exactement ce qui est utilisé dans
  `.phone-mockup-screen` (position absolute avec ces pourcentages). **Si vous changez d'image de
  cadre un jour, il faut remesurer ces insets** (petit script Python avec Pillow, lire l'alpha
  pixel par pixel le long d'une ligne horizontale/verticale au milieu de l'image, loin de l'îlot
  caméra, pour trouver où l'alpha passe de 255 à 0).
- **Contenu de l'écran du mockup** : reproduit en miniature le VRAI design du haut de la page
  `apropos.html` (pas une carte abstraite façon "profil e-commerce" comme dans la v2) — mini barre
  de header façon pilule (logo "NexThoury" + icône burger), eyebrow "À propos", photo ronde
  (`assets/portrait.jpg`), nom "Clément Thoury.", sous-titre. Demande explicite du client : que ça
  ressemble à une vraie capture d'écran de son site sur téléphone, avec en plus une petite photo
  (que la page À propos a nativement, contrairement à la page Contact). Purement décoratif, aucun
  lien cliquable dans ce mockup.
- **Le mockup téléphone DÉBORDE réellement hors de la carte** (2e itération, demande explicite
  avec un croquis à l'appui : "je voudrais... que le téléphone... sorte des contours du popup").
  La 1ère tentative le gardait contenu DANS la grille/carte (juste incliné) — pas ce qui était
  demandé. Pour permettre un vrai débordement visuel, la structure a changé :
  ```html
  <div class="expertise-popup-overlay">
    <div class="expertise-popup-frame">   <!-- pas de overflow:hidden ici -->
      <div class="expertise-popup">…texte, sa propre overflow-y:auto…</div>
      <div class="phone-mockup">…</div>   <!-- sibling de .expertise-popup, PAS un enfant -->
    </div>
  </div>
  ```
  `.phone-mockup` est en `position:absolute` (`top:-34px; right:-64px;`) par rapport à
  `.expertise-popup-frame` (qui n'a PAS de `overflow:hidden`) — donc rien ne le rogne. Seule
  `.expertise-popup` (la carte elle-même) garde `overflow-y:auto` pour permettre un scroll vertical
  du texte si jamais le contenu dépasse `max-height:80vh`, mais ça ne concerne que le TEXTE, plus
  le mockup qui est un sibling en dehors de cette zone de scroll.
  **Piège à ne pas refaire** : si le mockup redevient un enfant de `.expertise-popup` (ou de tout
  conteneur avec `overflow:hidden`/`auto`), il sera automatiquement rogné aux bords de ce
  conteneur, quel que soit son `position:absolute` — un élément ne peut jamais déborder visuellement
  d'un ancêtre qui a un `overflow` autre que `visible`.
  Incliné à `rotate(-13deg)` (sens inverse de la 1ère tentative — le client voulait "l'autre côté").
  `.expertise-popup` a un `padding-right:150px` pour laisser de la place au débord du mockup dans
  le coin supérieur droit sans chevaucher le texte (tag/titre/phrase/pilules).
- **Masqué sous 640px** (`.phone-mockup{display:none}`, et `.expertise-popup` repasse à un
  padding-right normal) — sur mobile, seul le texte + pilules + CTA reste.
- Le popup (`.expertise-popup-frame`) fait `max-width:640px` — plus de grille 2 colonnes (le
  mockup n'occupe plus de place dans la mise en page, il flotte par-dessus en `position:absolute`).
- **3e itération (tentative ratée) : effet "vitre qui coupe le téléphone" via blur.** Essayé en
  passant `.phone-mockup` en `z-index:1` sous `.expertise-popup` (`z-index:2`), pour que la portion
  qui chevauche la carte apparaisse floutée à travers le verre (comme la photo de la référence
  Scuffers derrière sa carte translucide). **Résultat rejeté par le client : "on ne voit plus le
  téléphone"** — le mockup est clair (fond blanc/bleu pâle) sur une carte elle-même clair et
  floutée : le flou blanc-sur-blanc rend le téléphone quasi invisible, contrairement à la photo
  sombre du Scuffers qui restait lisible même floutée. **Ne pas réutiliser cette technique de
  blur-derrière-la-carte tant que le mockup a un fond clair.**
- **4e itération : essai `clip-path` (40% puis 6%), abandonné.** `.phone-mockup` était passé en
  `z-index:3` (au-dessus de la carte, net) avec un `clip-path: inset(0 0 X% 0)` pour couper
  légèrement le bas du téléphone. Après plusieurs allers-retours sans jamais retomber sur le bon
  dosage visuel (40% trop coupé, 6% jugé pas encore satisfaisant), **le client a tranché : "laisse
  tomber, mets tout le téléphone"** — retour au mockup ENTIER, sans aucun `clip-path`. **Ne pas
  réintroduire de découpe sur `.phone-mockup` sans demande explicite** — le client préfère le
  visuel entier plutôt que de continuer à affiner un micro-détail de rognage.
- **État actuel (stable)** : `.phone-mockup` en `z-index:3` (au-dessus de la carte, net — pas de
  flou, cf. 3e itération rejetée plus haut), positionné en débord réel hors de
  `.expertise-popup-frame` (`top:-34px; right:-64px;`, cf. 2e itération), incliné
  `rotate(-13deg)`, **affiché intégralement, sans aucune découpe**. Le bouton de fermeture reste à
  `z-index:4`, toujours cliquable au-dessus de tout.

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
  forme d'accordéon vertical. Structure par famille (`.dropdown-mobile-item`) :
  ```html
  <div class="dropdown-mobile-item">
    <div class="dropdown-mobile-row">
      <a href="seo.html" class="dropdown-mobile-name">Agence SEO</a>
      <button type="button" class="dropdown-mobile-expand" aria-expanded="false" aria-label="…"></button>
    </div>
    <ul class="dropdown-mobile-sublist"> <li><a href="...">Sous-compétence</a></li> ... </ul>
  </div>
  ```
  **Volontairement PAS un `<details>/<summary>` natif** : le nom de la famille (`.dropdown-mobile-name`)
  est un lien classique qui navigue directement vers la page, et seul le bouton `.dropdown-mobile-expand`
  (icône "+" en CSS pur, ::before/::after) déplie/replie `.dropdown-mobile-sublist` (transition
  `max-height`). Avec un `<summary>` natif contenant un lien, cliquer le lien navigue ET déclenche le
  toggle en même temps (comportement peu fiable selon les navigateurs) — d'où la séparation stricte
  en deux éléments cliquables distincts. JS dans `script.js` (cherche `competences-mobile-accordion`) :
  un seul item ouvert à la fois (accordéon exclusif géré à la main, pas de `name=""` natif ici).
  Pour les 3 familles sans sous-compétences propres (Agence GEO, Social Media, Webdesign), le
  `.dropdown-mobile-sublist` contient un `<p class="dropdown-sub-empty">` descriptif au lieu d'un
  `<ul>` (même texte que le panneau desktop).
- Si vous ajoutez/renommez une famille ou une sous-compétence, il faut mettre à jour l'accordéon
  **sur les 16 pages** en plus du `.dropdown-panel` desktop (contenu dupliqué intentionnellement,
  pas de source unique — un script Python a servi à l'insertion/remplacement, voir git log).
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
- Sur mobile, `.showcase-item` (le texte) est plafonné à `max-width:340px` et `.showcase-item-img`
  (l'image) à `max-width:280px`, tous deux centrés (`margin:0 auto`) — plein écran faisait un bloc
  perçu comme "trop large" sur téléphone. Si vous ajustez ces valeurs, gardez le texte un peu plus
  large que l'image (meilleure lisibilité), toujours centrés.

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
  Corrigé en remplaçant par la propriété longhand `padding-top:18px` uniquement. **Le même bug
  existait aussi sur `.service-layout`** (`padding:80px 0`, combinée à `.container` sur les 2 pages
  sous-compétence) **et `.projet-breadcrumb`** (`padding:18px 0 0`, sur `projet-delmar.html`) — les
  deux corrigés de la même façon (longhand `padding-top`/`padding-bottom` uniquement). Piège
  général : ne JAMAIS redéclarer le raccourci `padding`/`margin` sur une classe destinée à être
  combinée avec `.container` — utiliser les propriétés longhand (`padding-top`, etc.) pour ne
  modifier qu'un côté. Avant d'ajouter une nouvelle classe combinée à `.container` quelque part,
  vérifiez qu'elle ne redéclare pas `padding`/`margin` en shorthand.
  **Piège n°2, plus retors : `.service-layout` avait DEUX déclarations** — la règle de base
  (corrigée ci-dessus) ET un override mobile séparé `@media (max-width:980px) { .service-layout {
  padding: 56px 0; } }` qui refaisait exactement la même erreur, plus bas dans le fichier. Corriger
  la règle de base ne suffit pas si une media query définit une AUTRE occurrence du même problème
  plus loin — toujours grep TOUTES les occurrences d'une classe (`grep -n "\.classe\b"`) avant de
  considérer un bug de padding/margin comme réglé, pas seulement la première trouvée.
  `.footer-top`, `.footer-legal-inner` et `.projet-nav` font aussi ce genre de redéclaration
  (`padding: Npx 32px` ou `20px`), mais leur valeur horizontale codée en dur coïncide
  actuellement avec celle de `.container` au même breakpoint — pas de bug visible aujourd'hui, mais
  fragile : si `.container` change un jour de padding, ces 3 classes ne suivront pas
  automatiquement.
- **Sliver de texte qui dépasse d'un accordéon replié (`.dropdown-mobile-sublist`) sur Safari
  iOS** : persistait même après être passé de `display:flex` à `display:block` (première
  tentative insuffisante — testé en vrai sur iPhone via capture d'écran, en navigation privée
  pour exclure le cache, le sliver de texte était toujours visible). **Fix définitif : ajouter
  `visibility:hidden` en plus de `max-height:0`/`overflow:hidden`**, avec une transition décalée
  (`transition: max-height .3s ease, visibility 0s linear .3s` replié ;
  `transition: max-height .3s ease, visibility 0s linear 0s` ouvert) pour que `visibility` bascule
  seulement APRÈS la fin de l'animation de fermeture (et immédiatement à l'ouverture, pour ne pas
  retarder l'apparition du contenu). `visibility:hidden` ne dépend d'aucun calcul de boîte/overflow
  et masque le contenu de façon garantie, quel que soit le navigateur — contrairement à
  `overflow:hidden` seul, qui peut avoir des comportements de bord imprévisibles selon le
  navigateur/la structure exacte du DOM. **Règle à suivre pour tout futur accordéon CSS (max-height
  + overflow:hidden) : ajoutez toujours `visibility:hidden` (avec la transition décalée ci-dessus)
  en complément — ne vous fiez pas à `overflow:hidden` seul pour garantir qu'aucun contenu ne
  dépasse visuellement.**
- **Rangée flèches + points du showcase (accueil) débordait largement sur mobile** : 9
  `.showcase-dot-btn` (28px + gap 8px) + 2 `.showcase-nav-btn` (38px) ≈ 430px de large, largement
  au-dessus des ~335px disponibles sur un téléphone standard (375px − 40px de padding). Ça créait
  un débordement horizontal de toute la page, perceptible comme "le bloc est décalé à droite /
  du contenu coupé" — d'autant plus qu'un swipe tactile sur le carrousel pouvait aussi scroller
  la page horizontalement à cause de ce débordement. Corrigé en masquant `.showcase-dots` sur
  mobile (le compteur texte "01/09" déjà affiché dans chaque carte suffit) et en gardant
  `overflow-x:hidden` sur `.showcase-pin` en filet de sécurité. Si vous rajoutez des points ou
  d'autres contrôles sur mobile, vérifiez toujours leur largeur totale contre un viewport de
  320-375px AVANT de les activer sur ce breakpoint.
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
