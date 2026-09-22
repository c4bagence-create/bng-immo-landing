# BNG landing — suivi Meta

Pixel : 1100056449551466. Périmètre : `/bng-immo-concept`.
Tous les événements sont bloqués avant accord publicitaire et après retrait. Aucun événement antérieur à l’accord n’est rejoué. Choix v2 (nouvel accord pour le périmètre interactions). Aucun budget, horizon d’achat, prénom, téléphone, texte libre ou valeur de champ n’est ajouté aux paramètres. Les paramètres sont filtrés par une liste fermée.

| Événement | Déclenchement | Comptage par document |
| --- | --- | --- |
| PageView | Chargement avec accord Meta | Une fois |
| project_selected | Sélection manuelle du programme, pas défilement automatique | Une fois par projet |
| gallery_interacted | Flèche, miniature ou swipe de la galerie | Une fois par projet |
| payment_step_selected | Choix manuel d’une tranche, clavier inclus | Une fois par projet/tranche |
| cta_clicked | Clic vers le formulaire | Chaque clic, section si identifiable |
| whatsapp_clicked | Clic du lien WhatsApp BNG | Chaque clic ; ne prouve pas l’envoi d’un message |
| section_viewed | Section visible à 25 % pendant 1 seconde, onglet visible | Une fois par section |
| scroll_depth | Position de défilement 25/50/75/90 % | Une fois par seuil ; un saut CTA peut atteindre un seuil |
| engaged_visit | 30/60/120 secondes avec onglet visible après consentement | Une fois par seuil ; pas une preuve de lecture |
| video_started | Lecture réelle de la vidéo HTML | Une fois par vidéo |
| video_progress | Position atteinte 25/50/75/100 % | Une fois par vidéo/seuil ; une avance manuelle peut atteindre un seuil |
| form_started | Première modification d’une réponse | Une fois |
| form_field_interacted | Première valeur non vide dans chaque champ | Une fois par nom de champ, jamais sa valeur |
| form_validation_error | Validation refusée | Une fois ; nombre de champs invalides uniquement |
| form_preview_completed | Les 4 champs passent la validation locale | Une fois ; **pas un Lead reçu** |

Pas d’enregistrement de session, de frappes clavier ou de mouvement de souris ajouté. Clarity/PostHog préexistants non modifiés. Pas de pile de pixels tiers supplémentaires sans compte/destination désigné.

## Conversion finale à connecter

Le formulaire est un aperçu sans envoi ni stockage. Ne pas utiliser `form_preview_completed` comme équivalent d’un lead reçu. Après raccordement CRM : générer un identifiant de soumission, attendre un succès serveur de création du lead, émettre `Lead` avec un `eventID` stable. Pour Conversions API : utiliser le même `event_name` + `event_id` côté serveur, vérifier le consentement et dédupliquer ; jeton Meta uniquement côté serveur. Aucun jeton ni CRM n’étant configuré pour ce parcours, cette étape n’est pas active.

## Audiences proposées (à créer dans Meta)

- Visiteurs de la landing.
- Projet sélectionné : `project_selected` et `project_id`.
- Intérêt fort : paiement consulté, galerie manipulée ou visite engagée.
- Formulaire commencé sans `form_preview_completed` (abandon du remplissage local, pas de la transmission CRM).
- Clics WhatsApp (intention de contact uniquement).

Les audiences, conversions personnalisées, règles et réception restent à vérifier dans le compte Meta. Consentement, bloqueurs et restrictions publicitaires peuvent réduire la mesure et les audiences disponibles.

Validation locale : `node scripts/bng-meta-pixel.test.cjs`, ESLint ciblé, build Next.js. Le test prouve le filtrage des paramètres, l’absence d’événements sans accord, la déduplication et le refus de `Lead` dans cet aperçu, pas la réception dans Meta.
