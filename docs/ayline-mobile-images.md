# Ayline Garden — adaptation mobile

Source : https://bngimmo.com/projets/ayline-garden

Les deux visuels officiels étaient déjà conservés dans `public/bng-projects/ayline-garden/site/`. La villa est native portrait (1600 × 2000) ; la vue aérienne est panoramique (2400 × 822). L'affichage `object-fit: contain` ajoutait des bandes beiges dans la galerie.

Conserver les originaux. Utiliser `cover` pour remplir le cadre sans étirer les images.

Résultat généré : `output/imagegen/ayline-square-preview.png`. Proposition non intégrée : la génération modifie certains détails du lotissement. La galerie utilise les sources officielles avec un cadrage couvrant le cadre, sans bandes beiges.

## Prompt de l'adaptation aérienne

Outil intégré imagegen, mode édition, source `ayline-garden-02-plan.jpg` :

> Edit target: attached official Ayline Garden architectural aerial render. Create a square 1:1 mobile gallery image by carefully reframing/cropping the CENTRAL portion of this exact image and enhancing resolution only. Preserve the exact existing buildings, road geometry, vegetation, materials, camera perspective, and warm daylight. It is a real estate project: do NOT invent buildings, roads, amenities, pools, mountains, or additional development, do not outpaint. A tighter crop is intended; prioritize the central villas and landscaping. Edge-to-edge image with NO blank borders, NO text, NO watermark. Retain the original architectural visualization style. Output square 1024x1024.
