# Clarity BNG

Projet fourni : `ylvf4t33ng`. Route : `/bng-immo-concept` uniquement.

- Le chargeur global historique est exclu de cette route ; ailleurs, l’identifiant d’environnement existant est préservé. Le placeholder invalide CLARITY_ID n’est plus chargé.
- Choix Clarity indépendant de Meta dans un panneau commun. Nouvelle préférence v3, aucun ancien accord Meta assimilé à un accord Clarity. Durée locale 180 jours.
- Aucun script Clarity avant accord analyse. `consentv2` : analytics granted, ads denied. Retrait : denied + stop. Un seul chargeur, reprise possible.
- Le formulaire complet porte `data-clarity-mask="true"`. Aucun identify, nom, téléphone, budget ou réponse transmis par une API personnalisée.
- La navigation SPA entre BNG et le reste de l’application recharge le document afin de ne pas conserver le SDK d’un autre projet.
- Clarity ne remplace pas le CRM et n’enregistre pas une demande de rappel. La réception des sessions dans le tableau de bord du compte reste à confirmer par son propriétaire.
- PostHog préexistant n’est pas reconfiguré dans cette tâche.

Tests : `node scripts/bng-clarity.test.cjs`, tests Meta existants, ESLint et build avant preview Vercel.

Vérification locale réussie : choix analyse seul = un chargeur Clarity ylvf4t33ng et zéro chargeur Meta ; choix publicité seul = zéro Clarity et un Meta ; refus après retrait et rechargement = zéro des deux. Formulaire masqué dans le DOM, panneau testé à 390 × 844, aucune erreur console observée. Cela ne confirme pas la réception des sessions côté compte Microsoft.

Références : https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2 ; https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api ; https://github.com/microsoft/clarity/blob/master/packages/clarity-js/src/clarity.ts
