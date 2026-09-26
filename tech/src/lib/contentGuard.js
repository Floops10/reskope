/* Dissuasion anti-copie globale.
   Bloque le menu contextuel (clic droit), la copie, le couper et le glisser
   PARTOUT, sauf à l'intérieur des champs de saisie — où l'utilisateur doit
   pouvoir écrire, sélectionner et copier son propre texte (formulaire, QCM).
   C'est une dissuasion volontaire, pas une protection absolue : le code
   source d'un site public reste par nature consultable. */

const inField = (el) =>
  !!(el && el.closest && el.closest('input, textarea, [contenteditable="true"]'));

export function initContentGuard() {
  if (typeof document === 'undefined') return () => {};

  const block = (e) => {
    if (!inField(e.target)) e.preventDefault();
  };

  document.addEventListener('contextmenu', block);
  document.addEventListener('copy', block);
  document.addEventListener('cut', block);
  document.addEventListener('dragstart', block);

  return () => {
    document.removeEventListener('contextmenu', block);
    document.removeEventListener('copy', block);
    document.removeEventListener('cut', block);
    document.removeEventListener('dragstart', block);
  };
}
