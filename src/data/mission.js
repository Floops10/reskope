/* ════════════════════════════════════════════════════════════
   UNE MISSION, TRAVERSÉE — la ville de l'accueil.

   Quatre quartiers, dans l'ordre où une mission se déroule : ce que vous
   croyez, ce que vivent vos clients, ce qui revient, ce que vous décidez.
   Chaque quartier est une scène de src/lib/scenes.js : la même géométrie
   que l'explorateur en 3D et que les affiches des emplacements vidéo, donc
   un seul dessin d'un bout à l'autre du site.

   Le texte tient en une ligne par étape. Le reste, c'est la scène qui le
   dit, et l'explorateur pour qui veut entrer dedans.
   ════════════════════════════════════════════════════════════ */

export const MISSION = {
  titre: 'Comment on trouve votre client idéal, en trois à quatre semaines.',
  etapes: [
    {
      figure: 'hypotheses',
      quand: 'Le premier lundi',
      nom: 'On écrit ce que vous croyez',
      dit: 'Ce qui doit être vrai pour que le projet tienne, classé du plus risqué au moins risqué.',
    },
    {
      figure: 'entretiens',
      quand: 'La première semaine',
      nom: 'On va voir vos clients',
      dit: 'Dix à douze entretiens sur ce qu’ils ont vécu, jamais sur ce qu’ils feraient.',
    },
    {
      figure: 'synthese',
      quand: 'Chaque vendredi',
      nom: 'On dessine votre client idéal',
      dit: 'Ce qui revient sans qu’on le souffle, avec leurs mots, et le portrait qui en sort.',
    },
    {
      figure: 'decision',
      quand: 'Le dernier vendredi',
      nom: 'Vous décidez sur des preuves',
      dit: 'Continuer, ajuster ou arrêter. Et si la suite demande un outil, on peut le construire.',
    },
  ],
  posture: 'Une heure et demie de votre temps par semaine. Le reste, c’est nous qui le faisons, et vous voyez tout ce qu’on fait.',
  act: 'Comment ça se passe, en détail',
  actTo: '/comment-ca-se-passe',
  ouvrir: 'Voir cette étape en 3D',
};
