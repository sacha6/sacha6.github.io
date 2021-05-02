# Compte Rendu Projet NSI

Le Projet choisi est basé sur la proposition #1.
Il s'agit de mettre de développer en javascript  un ensemble de filtres applicable sur des images. Cette application doit s'exécuter dans un navigateur et s'adapter à différents appareils (ordinateur, tablette, smatphone).

1. Les outils

   Les outils utilisés sont :
   * visual studio code
   * git 
   * chrome developper tools

2. Structure de l'application

   L'application est contenue dans 3 fichiers :
   * index.html : contient le html 
   * style.css : contient la feuille de style
   * color-manipulation.js : contient le code des différents filtres

3. Le code
   
   Les conventions utilisées dans le code sont :
   * noms de variables et de fonctions en anglais
   * format camelCase 
   * indentation 4 espaces
   * déclaration des fonctions :

```javascript
const blackWhite = function (data) { ...
```
plutot que
```javascript
function blackWhite(data) {
```
4. Principe de fonctionnement

Les images sont contenues dans un canvas qui est un objet javascript offrant une abstraction de l'image. En effet, peu importe son format elle est toujours disponible de la même manière en javascript.
On récupère un tableau contenant tous les pixels de l'image, sachant que chaque pixel est composé de 4 valeurs : rouge, vert, bleu et la transparence. Dans ce projet je n'utilise pas la transparence.
Un filtre est donc une transformation de ce tableau par une fonction. Ce tableau est ensuite transféré dans le canvas et est affiché. 

4. Les filtres

Filtres de couleurs

  * Sépia

Ce filtre transforme les couleurs en applicant une formule trouvée sur wikipédia sur chacun des composant de l'image. 
  * Noir et Blanc 

L'image résultant est une image composée uniquement de pixel blanc (255,255,255) et noir (0,0,0). On fait la moyenne des composants et s'il dépasse le seuil de 128, le pixel est blanc, sinon il est noir.
  * Niveaus de gris

Comme pour le Sépia, on calcule suivant une formule, une moyenne. On l'applique ensuite à tous les composants du pixel

Filtres manipulation d'image.
Contrairement aux filtres précédents, dans ces filtres on doit savoir sur quelle ligne et quelle colonne on fait l'opération. Pour une image de 800x600, la taille d'une ligne est 800x4 pixels. On peut à partir de là accéder à la ligne désirée. Pour accéder à la 10 ème ligne, on se postionne à 10x800x4. 

  * Canal+

Ce filtre est relativement simple. chaque ligne est décalée à gauche ou à droite, d'unnombre de pixels aléatoire. Le fait de générer cette image plusieurs fois par seconde donne une animation proche de l'encodage canal+. On remplace par du noir lorsque qu'on ne connait pas la couleur

  * La grille

Ce filtre, plus complexe dans la mesure où on doit dabord découper l'image en carré de 32x32, puis mélanger (en fait échanger) les cellules entre elles.


5. Axes d'améliorations

* La performance : certains filtres sont assez gourmands en calcul de par leur complexité. Par exemple le filtre pixel est composé de 4 niveaux de boucles imbriquées. Chrome indique par le biais d'un warning que le temps de traitment n'est pas optimal. Sur des très grosses images le navigateur répond moins bien. 
* L'utilisation de filtres écrits directement en css.