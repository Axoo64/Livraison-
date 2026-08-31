# Démos commerciales

Sites de démonstration servant à prospecter. **Ce dossier ne doit jamais être
déployé sur le domaine d'un client** (abs-cover.com notamment) : il s'héberge
séparément, sur ton propre nom de domaine.

## Organisation

    commun/modele.css    mise en page complète, pilotée par variables
    commun/modele.js     menu, galerie, lightbox, formulaire
    garage/index.html    habillage auto / carrosserie
    restaurant/index.html habillage restauration / bar

Le CSS et le JS sont partagés : une correction dans `commun/` profite
automatiquement à toutes les démos.

## Adapter une démo à un prospect (20-30 min)

Tout ce qui change est regroupé en haut du fichier `index.html`, dans le bloc
`FICHE CLIENT`. Rien à toucher ailleurs.

1. **Les couleurs** — bloc `:root`, 6 valeurs. Prends-les sur son logo, son
   enseigne, le marquage de son camion ou sa bannière Facebook (capture
   d'écran + pipette à couleur).
2. **Le logo** — remplace `photos/logo.png`.
3. **Les textes** — nom, téléphone, adresse, horaires, prestations.
4. **Les photos** — dépose ses images dans `photos/` en gardant les noms.

## Photos

Les emplacements sont stylés pour rester présentables sans photo, mais une
démo avec de vraies images convertit bien mieux. Sources gratuites et
utilisables commercialement : pexels.com, unsplash.com.

Formats attendus dans `photos/` :

    hero.jpg          1600x900  visuel principal
    service-1..4.jpg   800x600  une par prestation
    galerie-1..8.jpg   800x800  carrés, la galerie
    equipe.jpg        1200x800  section "à propos"
