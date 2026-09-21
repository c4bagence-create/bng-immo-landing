# BNG Immo — landing pages

Projet autonome extrait du prototype BNG, prêt à être repris par le développeur de **bngimmo.com**. Aucun code métier FAME/Maido, compte Supabase, secret ou accès CRM n’est nécessaire pour lancer ces pages.

> **Le formulaire n’envoie actuellement aucune demande.** Il s’agit d’un aperçu : le raccordement CRM et la mise en production du domaine restent à effectuer. Ne pas lancer une campagne de génération de leads sur le formulaire tant que la réception n’est pas testée.

## Démarrer

Node.js 22 et npm :

```sh
npm ci
npm run dev
```

Ouvrir http://localhost:3000. La racine redirige vers la page générale.

```sh
npm test
npm run lint
npm run build
npm start
```

## Pages livrées

| URL | Rôle |
| --- | --- |
| `/bng-immo-concept` | **Version principale actuelle**, cinq projets, sélection synchronisée, prix et échéanciers en DH |
| `/m-resort-concept` | Variante dédiée historique M Resort |
| `/jardin-alma-concept` | Variante dédiée historique Jardin d’Alma |

Les variantes historiques ne sont pas à jour de toutes les corrections commerciales de la page générale (notamment certaines mentions EUR et échéanciers). Les conserver comme références ; ne pas les publier comme offres contractuelles sans validation BNG.

## À lire pour la reprise

- [Guide développeur : CRM, domaine, recette](docs/DEVELOPER-HANDOFF.md)
- [Plan de tracking Meta](docs/bng-tracking-plan.md)
- [Clarity et confidentialité](docs/bng-clarity.md)
- [Manifeste des images officielles incluses](docs/media-manifest.json)

Stack : Next.js 16.2.10, React 19, TypeScript, Tailwind 4, Motion et Lucide. `package-lock.json` fixe les dépendances. Les SVG animés sont dans les composants React, pas dans un outil externe payant.

## Organisation

```text
src/app/bng-immo-concept/     page générale, données projets, formulaire, Meta/Clarity
src/app/m-resort-concept/     composants partagés et variante M Resort
src/app/jardin-alma-concept/  variante Jardin d’Alma
public/bng-projects/         images officielles embarquées (pas de hotlink obligatoire)
public/m-resort-concept/     photos terrain, témoignages MP4, visuels et archives
public/bng-2026/             police Montserrat utilisée par la variante historique
scripts/                    tests tracking et vérification du package
docs/                       reprise et inventaire médias
```

Les médias BNG sont remis pour ce projet ; aucun droit de réutilisation pour d’autres clients n’est accordé par ce dépôt. Les anciens médias de placement conservés dans `placeholders/` et `payment/` ne sont pas à présenter comme preuves réelles. La version générale emploie des SVG pour le paiement.

Pas de licence open source ajoutée : dépôt privé destiné au client et à son développeur.
