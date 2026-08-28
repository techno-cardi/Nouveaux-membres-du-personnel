# Portail Cardinal-Roy

Portail statique de référence pour le personnel de l’École secondaire Cardinal-Roy.

## Architecture actuelle

- `index.html` : point d’entrée et chargement de l’interface
- `body-part-*.txt` : contenu source historique utilisé pour reconstruire les fiches
- `source-patches.js` à `source-patches-4.js` : enrichissements du contenu avant rendu
- `ui-polish.js` : reconstruction de l’interface, catégories et favoris
- `after-ui.js` : ajustements ciblés du contenu rendu et indexation des sous-ressources CSSC
- `global-search-flash.js` : moteur de recherche actif unique, recherche tolérante aux fautes, navigation au clavier, surlignage sécuritaire, ouverture des fiches, flash visuel et retour en haut
- `styles.css`, `guide-updates.css`, `logo.css` : mise en page et identité visuelle

## Robustesse

Le moteur de recherche remplace au chargement les anciens écouteurs de recherche afin qu’un seul moteur soit actif. Les résultats normaux et les sous-ressources d’Applications CSSC sont indexés ensemble.

Le logo Mozaïk-Portail utilisé pour les présences et les avis SOI est intégré directement au portail. Les autres images distantes disposent d’un remplacement visuel automatique si leur source devient indisponible, afin d’éviter les icônes d’image brisée.

Le portail est publié automatiquement avec GitHub Pages à partir de la branche `main`.
