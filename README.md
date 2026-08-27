# Portail Cardinal-Roy

Portail statique de référence pour le personnel de l’École secondaire Cardinal-Roy.

## Architecture actuelle

- `index.html` : point d’entrée et chargement de l’interface
- `body-part-*.txt` : contenu source historique utilisé pour reconstruire les fiches
- `source-patches.js` à `source-patches-4.js` : enrichissements du contenu avant rendu
- `ui-polish.js` : reconstruction de l’interface, catégories, favoris et recherche principale
- `after-ui.js` : ajustements de l’interface et recherche détaillée des ressources CSSC
- `global-search-flash.js` : surlignage sécuritaire des résultats, ouverture visuelle et retour en haut
- `styles.css`, `guide-updates.css`, `logo.css` : mise en page et identité visuelle

Le portail est publié automatiquement avec GitHub Pages à partir de la branche `main`.
