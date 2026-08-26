# Direction visuelle — Guide du personnel Cardinal-Roy

## Mode

**Read** : le site est un guide de référence interne. La priorité est de trouver une procédure rapidement, puis de la lire sans distraction.

## Monde visuel

Le site doit rappeler un **manuel de référence scolaire bien édité**, pas une landing page, un tableau de bord SaaS ou une collection de cartes générées automatiquement.

- fond papier chaud, surfaces presque blanches;
- bourgogne Cardinal-Roy utilisé avec parcimonie pour les liens, états actifs et détails institutionnels;
- Source Serif 4 pour les titres, Source Sans 3 pour le texte et l'interface;
- séparateurs fins, presque aucune ombre;
- pas de dégradé décoratif, glassmorphism, gros badges, pilules ou cartes répétitives;
- pas d'emoji comme système d'icônes;
- pas de kicker/eyebrow au-dessus des titres;
- pas de mots-clés internes visibles;
- les messages d'aide utilisent un ton calme : « Conseil », « Bon à savoir », jamais une accumulation d'avertissements rouges.

## Architecture de l'information

La page suit le modèle mental d'un nouveau membre du personnel :

1. **Je veux…** — accès direct par tâche;
2. **Recherche** — support pour un mot, une application ou une formulation imprécise;
3. **Sommaire** — 5 à 15 grandes catégories maximum, libellées dans le vocabulaire des utilisateurs;
4. **Procédures** — contenu détaillé à l'intérieur de chaque catégorie.

La recherche complète la structure; elle ne la remplace pas.

## Composition

### En-tête

Petit masthead institutionnel : logo, « Guide du personnel », une phrase descriptive et trois liens utilitaires discrets. Aucun hero surdimensionné.

### Accès rapides

Liste textuelle en colonnes. Pas de cartes égales « icône + titre + description ».

### Lecture

Desktop : sommaire sticky à gauche et colonne de lecture de 65–75 caractères à droite. Mobile : sommaire compact au-dessus du contenu.

Les procédures sont séparées par des lignes fines. Les étapes utilisent une numérotation imprimée simple (`1.`, `2.`, `3.`), jamais des pastilles rouges.

### Notes

Les callouts sont des notes neutres avec une bordure de 1 px. Le raccourci Windows + V est présenté comme une note de travail avec de vrais éléments `<kbd>`.

## Accessibilité et finition

- contraste du texte courant ≥ 4.5:1;
- focus visible avec `:focus-visible`;
- cibles tactiles d'au moins 44 px lorsque pertinent;
- `prefers-reduced-motion` respecté;
- lien d'évitement vers le contenu principal;
- titres équilibrés avec `text-wrap: balance` et texte courant avec `text-wrap: pretty`;
- thème appliqué aussi à la sélection, au caret, au scrollbar et aux états hover/focus;
- aucun défilement horizontal sur petit écran.

## Anti-patterns à éviter lors des prochaines modifications

- ajouter une nouvelle carte pour chaque information;
- utiliser des emojis comme décoration ou navigation;
- créer un nouveau badge « Important », « À connaître », « Essentiel »;
- multiplier les couleurs pour distinguer des contenus semblables;
- ajouter des ombres ou arrondis pour « moderniser »;
- transformer la page en dashboard;
- exposer les synonymes ou mots-clés utilisés par le moteur de recherche.
