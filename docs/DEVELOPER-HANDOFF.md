# Reprise développeur — BNG Immo

## 1. Périmètre livré

Extraction autonome du travail validé au 21 septembre 2026. La page de référence est `/bng-immo-concept`. Le dépôt contient le code UI, les SVG animés, photos locales, témoignages, sources des prix/échéanciers dans les données, tests et configuration de build. Aucun service FAME, login interne, middleware d’auth, base agence, PostHog global, Clarity d’un autre client, Sentry, service worker ou clé privée n’a été transféré.

La racine `/` redirige vers la page générale afin de conserver les routes existantes. Le développeur peut ensuite décider de la monter à la racine, à une URL de campagne ou sur un sous-domaine BNG. Vérifier alors les ancres, la portée du consentement et les métadonnées.

## 2. Données et contenus

- `src/app/bng-immo-concept/projects.ts` : cinq projets, prix en DH, surfaces, localisation, livraison, photos et échéanciers. C’est la source utilisée par le hero et le plan de paiement synchronisés.
- `types.ts` : schéma `BngProject` / `PaymentStep`.
- `ProjectProofs.tsx` (dossier M Resort) : El Messaoudi Home, Jardin d’Éden et Jardin d’Alma.
- `ClientStories.tsx` : témoignages réels locaux.
- `BngGeneral.tsx` : ordre des sections, textes, CTA et lien WhatsApp public +212673322505.
- SVG de données : `ProjectFacts`, `ProjectAmenities`, `ProjectPayment`, `BngLegalDossier`, `FinalInvitation`, `AnimatedBngLogo`.

Derniers montants utilisés par la page générale : Alma 2 900 000 DH, M Resort 1 252 000 DH, Naïa Hills 1 500 000 DH, Elyazia 869 500 DH, Ayline Garden 1 750 000 DH. À revalider avec le stock BNG avant publication. L’ancienne note de vérification du 19 septembre mentionnée dans un commentaire source est remplacée ici par les données actuelles ; ce n’est pas un inventaire temps réel.

Échéanciers : Alma 30/20/20/20/10 (réservation, M6, M12, M18, clés), M Resort 30/15/15/40 (réservation, M6, M12, clés), Naïa 30/40/15/15 (réservation, M6, M12, remise du titre), Elyazia 40/25/20/15 (réservation, M6, M12, clés), Ayline 80/20 (réservation, remise du titre).

## 3. Brancher le CRM — tâche prioritaire

**Actuellement : aucun appel API, aucun stockage serveur, aucune demande reçue.**

Page générale : `src/app/bng-immo-concept/ProjectQualification.tsx`, fonction `handleSubmit`. Le budget, horizon, prénom et téléphone sont dans `answers`; le projet dans `project.id`. La validation est locale, avec message « Aucun envoi effectué ». Les variantes historiques ont leur propre `submitQualifier` dans `MResortConcept.tsx`, lui aussi non connecté.

Le nom du CRM, son endpoint, ses identifiants et le mapping des champs ne sont pas encore fournis. `.env.example` contient uniquement des noms indicatifs, non consommés par le code actuel.

### Contrat d’intégration proposé (à implémenter, pas existant)

`POST /api/leads` côté serveur Next.js, ou endpoint sécurisé du site BNG existant :

```json
{
  "submissionId": "UUID stable pour une tentative et ses retries",
  "projectId": "jardin-alma",
  "budget": "2m-3m",
  "timing": "under-3-months",
  "firstname": "Prénom",
  "phone": "+212…"
}
```

Budgets : `up-to-500k`, `500k-1m`, `1m-2m`, `2m-3m`, `over-3m`, `to-define`. Il s’agit du **prix total envisagé**, pas de l’apport.

Horizons : `under-3-months`, `3-6-months`, `over-6-months`, `exploring`.

Projets : `jardin-alma`, `m-resort`, `naia-hills`, `elyazia`, `ayline-garden`.

À implémenter :

1. Validation **serveur** des valeurs et normalisation du téléphone avec indicatif ; limites de taille.
2. Secret CRM uniquement serveur ; jamais variable `NEXT_PUBLIC_*`, client JS ou dépôt Git.
3. Idempotence par `submissionId`, état en cours, désactivation du double clic, gestion des erreurs et retries.
4. Protection anti-spam adaptée, limitation de débit et absence de coordonnées dans les logs.
5. Réponse succès seulement après confirmation CRM (ou stockage durable avec traitement fiable). Ne pas simuler un succès.
6. Remplacer les mentions d’aperçu par un message exact, ajouter les informations de confidentialité/contact et retention validées par BNG.
7. Tester une demande fictive de bout en bout et confirmer sa présence chez le conseiller.

Ne pas enregistrer silencieusement le prénom ou téléphone au fil de la frappe. Le suivi d’interaction existant ne contient pas les valeurs des champs.

## 4. Meta et Clarity

- Pixel Meta public : `1100056449551466`, `meta-pixel.ts`.
- Clarity public : `ylvf4t33ng`, `clarity-tracking.ts`.
- `MetaPixelConsent.tsx` gère deux choix séparés analyse/publicité, refus et retrait. Clarity n’est pas subordonné à l’accord Meta.
- **Aucun script de tracking global supplémentaire n’est présent dans cette extraction.** Avant intégration dans bngimmo.com, vérifier les tags déjà chargés par le site/CMP/GTM pour éviter doublons et conflits. Si une CMP existe, remplacer le panneau local par ses signaux de consentement.
- Formulaire masqué avec `data-clarity-mask="true"`; pas de `identify` Clarity ni d’advanced matching Meta avec les coordonnées.
- `PageView` après accord ; interactions documentées dans le plan tracking. `form_preview_completed` = validation locale, **pas un vrai Lead**.
- Pour `Lead` après CRM : étendre explicitement la liste d’événements, attendre le succès serveur et émettre une seule fois par identifiant de soumission. CAPI éventuelle : mêmes `event_name`/`event_id` navigateur/serveur, token serveur, choix de consentement respecté. Ne pas utiliser `form_preview_completed` comme conversion de prospect reçu.
- Tester dans Meta Events Manager et dans le compte Clarity. Les tests de ce dépôt ne prouvent pas la réception dans les comptes externes.

## 5. Médias et dépendances externes

Les photos `bngimmo.com/images/projets/…` sont copiées dans `public/bng-projects/` et les références adaptées pour permettre un déploiement autonome. `docs/media-manifest.json` conserve leur origine et leur taille. Les photos terrain et témoignages MP4 sont sous `public/m-resort-concept/`. Aucun fichier `.env`, token, dump CRM ou donnée d’agence n’est embarqué.

Dépendances externes restantes voulues : vidéo YouTube officielle dans la variante M Resort, liens de visite Vertex, WhatsApp, scripts Meta/Clarity après consentement, téléchargement de la police Inter par Next au build. La police Montserrat locale est incluse. Les anciens médias inactifs sont conservés pour la reprise, pas destinés à remplacer les preuves réelles.

## 6. Déploiement et domaine

Projet Next.js standard : `npm ci`, `npm run build`, `npm start`. Sur Vercel : importer **ce nouveau dépôt**, choisir la branche de livraison, preset Next.js, root `.`. Ne pas réutiliser le projet FAME ni ses variables. Autre hébergeur : prévoir un runtime Node compatible et le routage Next/Image.

Ne pas remplacer automatiquement bngimmo.com : vérifier avec son développeur la stack existante, les routes à conserver et la stratégie de montage. Si le site existant est WordPress ou une autre stack, ces composants React/Next ne se copient pas tels quels dans un thème PHP : déploiement séparé sous-domaine/reverse-proxy ou portage décidé par le développeur.

Le propriétaire du domaine doit configurer les enregistrements DNS indiqués par l’hébergeur, puis vérifier TLS, redirections www/non-www, conservation des paramètres de campagne et accès mobile. Aucun DNS n’a été changé lors de cette livraison.

Les layouts contiennent `robots: { index: false, follow: false }` pour les aperçus. Avant production, définir le domaine canonique, titres/descriptions actualisés, robots et sitemap selon le périmètre retenu. Les métadonnées des variantes historiques nécessitent une révision.

## 7. Recette avant lancement

- `npm ci` sur un clone propre ; tests, lint, build.
- iPhone 375/390 px : hero, choix de projets, galeries, SVG, paiement et CTA vers le formulaire sans saut de retour.
- Contrôler tous les médias, les échéances et les prix avec BNG.
- Formulaire : champs manquants, téléphone invalide, succès CRM, timeout, double clic, retry ; aucune fausse confirmation.
- Refus : aucun Meta/Clarity ; accepter un seul fournisseur ne charge pas l’autre ; retrait et rechargement vérifiés.
- Vérifier le masquage dans une session Clarity de test, sans vraies coordonnées.
- Meta : `PageView` unique, aucune conversion sur affichage simple, `Lead` uniquement après réception CRM.
- Valider les textes de confidentialité, les liens utiles et la politique de conservation avant campagnes.

## 8. Transmission GitHub

Dépôt privé. Travail livré sur `codex/developer-handoff` via pull request, sans accès donné à un tiers automatiquement. Le développeur doit être invité avec son compte GitHub par le propriétaire. Aucun transfert de propriété ni publication publique n’est nécessaire.
