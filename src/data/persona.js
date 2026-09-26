/* ════════════════════════════════════════════════════════════
   LES TROIS PERSONNES POUR QUI CE SITE EXISTE — la discovery de Reskope.

   Tout le site se lit à travers elles. Une section qui ne répond à aucune
   de leurs questions n'a rien à faire sur une page, quelle que soit la
   qualité de son animation.

   Ces portraits sont une discovery DE BUREAU : des chiffres publics
   (sources ci-dessous) et ce que Reskope sait de ses premiers contacts. Ce
   sont des hypothèses solides, pas des vérités : les entretiens du plan
   d'action les confirmeront ou les corrigeront, et le site avec eux.

   Sources (consultées en septembre 2026) :
   - Insee Première n° 2092, Les créations d'entreprises en 2025
     https://www.insee.fr/fr/statistiques/8721354
   - Insee Première n° 2007, Les créateurs d'entreprise en 2022
     https://www.insee.fr/fr/statistiques/8231755
   - Insee Flash Hauts-de-France n° 178, créations d'entreprises en 2025
     https://www.insee.fr/fr/statistiques/8989994
   - Insee Première n° 2070, pérennité à cinq ans des entreprises de 2018
     https://www.insee.fr/fr/statistiques/8634190
   - BPCE L'Observatoire, cession-transmission des TPE et PME
     https://newsroom.groupebpce.fr/actualites/bpce-lobservatoire-veut-mettre-fin-aux-estimations-erronees-et-aux-idees-recues-sur-la-cession-transmission-des-tpe-et-pme-en-france-pour-une-action-publique-mieux-ciblee-1f180-7b707.html
   - France Num, baromètre 2025 des TPE et PME
     https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2025-le
   ════════════════════════════════════════════════════════════ */

export const PERSONAS = {
  creation: {
    portrait: 'ines',
    nom: 'Inès, 31 ans',
    qui: 'Elle quitte son poste pour ouvrir un coffee shop. Ou il reprend la menuiserie de son ancien patron. Une personne qui crée ou reprend, souvent pour la première fois.',
    chiffres: [
      { n: '1 170 000', t: 'entreprises créées en France en 2025, un record', src: 'Insee Première n° 2092' },
      { n: '71 783', t: 'créations dans les Hauts-de-France en 2025, dont deux tiers de micro-entrepreneurs', src: 'Insee Flash Hauts-de-France n° 178' },
      { n: '8 sur 10', t: 'créent une entreprise pour la première fois ; 4 sur 10 démarrent sans moyens financiers', src: 'Insee Première n° 2007' },
      { n: '75 000', t: 'reprises d’entreprises au moins, chaque année', src: 'BPCE L’Observatoire' },
    ],
    situations: [
      'Je suis sûr de mon idée, mais je n’ai jamais demandé à un client.',
      'Je dois faire un business plan, et je ne sais pas par où commencer.',
      'Mon rendez-vous à la banque approche, et je ne sais pas si mon dossier tient.',
      'Je reprends une entreprise, et je veux savoir si ses clients resteront.',
    ],
    craintes: [
      'Engager ses économies ou un prêt sur une idée que personne n’a vérifiée.',
      'Se faire refuser par la banque sans comprendre pourquoi.',
      'Payer un consultant pour un document qu’il ne saura pas défendre.',
    ],
    nEnvieDe: 'L’étude de marché, les chiffres, la paperasse, la communication : tout ce qui l’éloigne de son métier.',
    ton: 'Chaleureux et concret. On parle de « votre projet », de « vos futurs clients », jamais de méthode. Des exemples qu’il reconnaît : un coffee shop, un atelier, un logiciel.',
    couleur: 'soleil',
    images: 'Une personne au travail sur son projet, chez elle ou dans son futur local, en lumière naturelle.',
  },
  tpe: {
    portrait: 'karim',
    nom: 'Karim, 44 ans',
    qui: 'Chauffagiste, trois salariés, une camionnette et un téléphone qui sonne toute la journée. Il dirige une entreprise de 1 à 10 personnes et fait tout lui-même, y compris ce qu’il n’aime pas.',
    chiffres: [
      { n: '84 %', t: 'des TPE et PME ont au moins une présence en ligne, site ou réseaux', src: 'France Num 2025' },
      { n: '40 %', t: 'disent que le numérique contribue directement à leur chiffre d’affaires', src: 'France Num 2025' },
    ],
    situations: [
      'On me trouve mal en ligne, et mes clients passent par la concurrence.',
      'Je rappelle mes clients le soir pour caler des rendez-vous.',
      'Je fais autant de devis qu’avant, et j’en signe moins.',
    ],
    craintes: [
      'Perdre du temps qu’il n’a pas.',
      'Payer un site qui ne lui ramène personne.',
      'Dépendre d’un prestataire pour le moindre changement.',
    ],
    nEnvieDe: 'Le site, les rendez-vous en ligne, les réseaux, les relances : tout ce qui se fait après sa journée.',
    ton: 'Direct et pratique. Des phrases courtes, des durées et des résultats. « Vous arrêtez de rappeler le soir. »',
    couleur: 'menthe',
    images: 'Un artisan ou un commerçant sur le terrain, entre deux clients.',
  },
  pme: {
    portrait: 'nathalie',
    nom: 'Nathalie, 52 ans',
    qui: 'Elle dirige une menuiserie-agencement de 24 personnes. Des logiciels payés depuis des années, des équipes qui ressaisissent, et une question qui revient : où part le temps ?',
    chiffres: [
      { n: '52 %', t: 'des dirigeants de TPE et PME s’inquiètent du piratage de leurs données', src: 'France Num 2025' },
      { n: '3 sur 4', t: 'ont un budget dédié au numérique', src: 'France Num 2025' },
    ],
    situations: [
      'Nos outils ne se parlent pas, et la même information est saisie trois fois.',
      'Personne ne sait dire qui utilise quoi, ni ce que ça coûte.',
      'On veut comprendre pourquoi nos clients achètent, avant d’investir.',
    ],
    craintes: [
      'Un audit qui finit dans un tiroir.',
      'Bouleverser des équipes qui ont leurs habitudes.',
      'Racheter des outils au lieu de faire marcher ceux qu’elle paie.',
    ],
    nEnvieDe: 'Faire le tour des postes, cartographier les outils, chiffrer le temps perdu : le travail que personne n’a le temps de faire en interne.',
    ton: 'Posé et chiffré. On parle de temps gagné, de coûts, d’équipes, avec des sources. Un cran plus formel.',
    couleur: 'ciel',
    images: 'Une dirigeante dans son atelier ou avec ses équipes, les outils en arrière-plan.',
  },
};

/* Les mots de la méthode, traduits en mots de client (utilisés sur la page
   « Comment ça se passe »). */
export const MOTS = {
  discovery: 'aller voir vos clients',
  persona: 'le portrait de votre client idéal',
  hypothese: 'ce que vous croyez, et qu’on va vérifier',
  test: 'un essai qui coûte peu',
  sprint: 'une semaine de travail, avec un point le vendredi',
};

/* Compatibilité : l'ancienne forme de ce fichier. */
export const PERSONA = { mots: MOTS };
