/* Glyphes de marque — le langage nœuds/liens décliné en 4 icônes-réseau.
   Utilisés comme objets flottants 3D dans la traversée caméra (HomeCinema)
   et réutilisables partout (currentColor). */

export function GlyphAudit(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="15" y1="15" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1.8" fill="currentColor" />
      <circle cx="21" cy="21" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function GlyphLink(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="5.5" cy="7" r="3.2" fill="currentColor" />
      <circle cx="18.5" cy="17" r="3.2" fill="currentColor" />
      <line x1="8" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function GlyphBurst(props) {
  const spokes = [0, 60, 120, 180, 240, 300].map((a) => {
    const r1 = 4.6, r2 = 9.4;
    const rad = (a * Math.PI) / 180;
    return (
      <line
        key={a}
        x1={12 + Math.cos(rad) * r1} y1={12 + Math.sin(rad) * r1}
        x2={12 + Math.cos(rad) * r2} y2={12 + Math.sin(rad) * r2}
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      />
    );
  });
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      {spokes}
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <circle key={`n${a}`} cx={12 + Math.cos(rad) * 9.4} cy={12 + Math.sin(rad) * 9.4} r="1.4" fill="currentColor" />;
      })}
    </svg>
  );
}

export function GlyphLoop(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 12a7 7 0 0 1 11.9-5M19 12a7 7 0 0 1-11.9 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16.9" cy="7" r="1.7" fill="currentColor" />
      <circle cx="7.1" cy="17" r="1.7" fill="currentColor" />
    </svg>
  );
}

export const BRAND_GLYPHS = [GlyphAudit, GlyphLink, GlyphBurst, GlyphLoop];
