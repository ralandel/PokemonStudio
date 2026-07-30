# Brief Agent - fiabiliser l'usage de ts-tiled-converter dans PokemonStudio

## Contexte
Le projet PokemonStudio consomme ts-tiled-converter depuis un fork GitHub:

- github:ralandel/ts-tiled-converter#perspective-3d

Constat actuel:

- npm ls ts-tiled-converter montre bien le fork (OK).
- Le demarrage npm start de PokemonStudio devient tres lent pendant le build du process main.
- Le package installe depuis GitHub semble ne pas fournir dist/ alors que package.json declare main: dist/index.js.
- Le bundler (Vite/Electron Forge) retombe sur des sources TypeScript du package, ce qui degrade fortement le temps de demarrage.

## Objectif
Rendre le fork ralandel/ts-tiled-converter consommable proprement par un projet Electron/Vite via dependance GitHub, avec un demarrage rapide et stable.

## Ce que tu dois faire dans le fork
1. Verifier la coherence du packaging npm:
- main doit pointer vers un fichier effectivement publie.
- types doit pointer vers les declarations effectivement publiees.
- si exports est defini, il doit etre coherent avec main et types.

2. Garantir la generation des artefacts build lors d'une installation Git:
- Ajouter un script prepare qui lance le build.
- Le build doit produire dist/index.js et les .d.ts requis.

3. Nettoyer ce qui est publie:
- Inclure uniquement les fichiers necessaires a l'execution (dist, types, readme, license).
- Exclure les tests/snapshots/sources inutiles a la runtime si possible.

4. Verifier la compatibilite CommonJS/ESM:
- S'assurer que la sortie est chargeable par Node/Electron dans le contexte actuel de PokemonStudio.
- Eviter toute resolution ambigue qui force le bundler a parser le source TS du package.

5. Faire une release consommable:
- Commit sur perspective-3d.
- Donner le SHA final pour pinning eventuel.

## Verification obligatoire (dans le fork)
Executer et fournir les resultats:

1. Build local du fork
- npm ci
- npm run build

2. Verification packaging
- npm pack --dry-run
- Lister les fichiers inclus: dist/** et declarations types presentes.

3. Verification install depuis Git (repo de test propre)
- Installer github:ralandel/ts-tiled-converter#perspective-3d
- Verifier que node_modules/ts-tiled-converter/dist/index.js existe.

## Verification obligatoire (dans PokemonStudio)
1. Dans PokemonStudio:
- npm install
- npm ls ts-tiled-converter

2. Verifier la presence des artefacts:
- node_modules/ts-tiled-converter/dist/index.js existe.

3. Mesurer le demarrage:
- Lancer npm start
- Le temps de build du main process ne doit plus prendre plusieurs minutes.

## Criteres d'acceptation
- Le fork est bien utilise (source GitHub ralandel, branche perspective-3d ou SHA cible).
- Le package installe contient bien dist/ et types attendus.
- Aucune resolution vers lib/*.ts du package au runtime dans PokemonStudio.
- npm start revient a un comportement proche de l'immediat (hors premier warm-up normal).
- Aucun changement requis dans le code applicatif PokemonStudio pour contourner le probleme.

## Livrables attendus de l'agent
- Diff des fichiers modifies dans le fork (package.json, config TS, etc.).
- SHA du commit final.
- Resultats des commandes de verification (build, pack dry-run, install Git, verification dist).
- Conclusion claire: OK pret pour integration PokemonStudio ou liste precise des blocages restants.

## Notes importantes
- Ne pas modifier le package.json genere dans un dossier out/ de PokemonStudio.
- Les changements doivent etre faits dans le fork ts-tiled-converter, pas dans le code metier PokemonStudio.
