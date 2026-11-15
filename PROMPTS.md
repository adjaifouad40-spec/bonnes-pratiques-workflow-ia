# Prompts IA utilisés

L'assistant IA utilisé est **Claude**. Il a joué le rôle prévu pour le chat IA de Cursor : on lui a donné le code et on lui a demandé de trouver les bugs, de les corriger puis de refactoriser. Chaque réponse a ensuite été **vérifiée** : rendu dans le navigateur et tests automatiques (`apres/test.html`, 12 tests sur 12).

## Prompt 1 : diagnostic
> Voici une carte de prix en HTML/CSS (code collé). La mise en page est cassée et le bouton « Start Trial » ne répond pas. Liste tous les bugs de mise en page, de CSS, d'accessibilité et de JavaScript, en expliquant la cause de chacun. Ne réécris pas encore le code.

**Résultat :** les 6 problèmes listés dans le README (balise `<h2>` non fermée, `box-shdow`, largeur fixe, en-tête incomplet, bouton sans gestionnaire, focus clavier invisible).

## Prompt 2 : correction minimale
> Corrige uniquement ces bugs, en gardant la même structure HTML et les mêmes classes. Ajoute un commentaire `FIX` à chaque correction pour que je voie ce qui a changé.

**Résultat :** `apres/carte-corrigee.html`.

## Prompt 3 : refactorisation en composant réutilisable
> Transforme cette carte en un composant JavaScript vanilla réutilisable `Card(title, price, features)` qui renvoie un élément DOM. Contraintes :
> - utiliser `createElement` et `textContent` (pas d'`innerHTML`, pour éviter les injections) ;
> - un 4e paramètre optionnel `options` (devise, période, texte du bouton, carte mise en avant, badge, callback `onSelect`) ;
> - vérifier les paramètres (titre vide, prix non numérique, features absent) ;
> - le bouton doit réagir au clic ;
> - CSS séparé avec des variables pour les couleurs, responsive, sans largeur fixe ;
> - une fonction `renderCards(container, plans)` pour afficher plusieurs offres à partir d'un tableau de données.

**Résultat :** `apres/card.js` et `apres/card.css`.

## Prompt 4 : page de test
> Crée une page `index.html` qui affiche 3 offres (Basic, Pro mise en avant, Business) avec ce composant, et une page `test.html` qui teste le composant dans le navigateur et affiche ✅ ou ❌ pour chaque test.

**Résultat :** `apres/index.html` et `apres/test.html`.

## Vérifications faites après les réponses de l'IA
- Le rendu « avant » confirme le bug principal : dans le navigateur, le `<h2>` non fermé englobe le prix, la liste et le bouton (2 `<h2>` dans le DOM et le bouton placé *dans* un titre).
- Le clic fonctionne sur les 3 cartes, et le message de confirmation s'affiche.
- La mise en page est correcte en 1200 px (3 colonnes) et en 375 px (1 colonne), sans débordement.
- 12 tests sur 12 réussis.
