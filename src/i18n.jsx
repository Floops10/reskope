import { createContext, useContext, useEffect, useCallback } from 'react';

/* ============================================================
   Internationalisation FR / EN
   - useLang() : { lang, setLang } (langue globale, persistée)
   - useT()    : dictionnaire PARTAGÉ pour la langue courante
                 (nav, footer, CTA, carte de visite, commun)
   Le contenu propre à chaque page est défini localement dans la
   page via un objet CONTENT[lang], piloté par useLang().
   ============================================================ */

const SHARED = {
  fr: {
    nav: {
      tabs: {
        '/pourquoi': 'Le constat',
        '/methode': 'La méthode',
        '/offres': 'Offres',
        '/exemple': 'Exemple de bilan',
        '/atelier': 'L’atelier',
        '/numerique-responsable': 'Numérique responsable',
        '/a-propos': 'À propos',
      },
      cta: 'Me contacter',
      ctaBook: 'Réserver 30 min',
      menu: 'Menu',
      close: 'Fermer',
      menuEyebrow: 'Navigation',
      asideEyebrow: 'On en parle ?',
      asideTitle: 'Et si on refaisait le point sur vos outils ?',
    },
    cta: {
      aria: "Appel à l'action",
      eyebrow: 'On en parle ?',
      title: 'Et si on refaisait le point sur vos outils ?',
      text: "Un premier échange pour comprendre votre contexte, sans engagement. On vous dit honnêtement s'il y a quelque chose à faire.",
      primary: 'Parler de vos outils',
      secondary: 'Écrire un message',
    },
    footer: {
      tagline:
        'Audit digital et productivité. On part du terrain, salarié par salarié, pour vous rendre du temps.',
      cta: 'Parlons de vos outils',
      site: 'Le site',
      resources: 'Ressources',
      contact: 'Contact',
      home: 'Accueil',
      logo: 'Logo (SVG)',
      card: 'Carte de visite',
      talk: 'Parler de vos outils',
      zone: 'Valenciennes et Lille',
      sign: 'On remet vos outils en ordre.',
      rights: 'Conseil et ingénierie numérique',
      meta: 'Démarche ouverte · cadre clair · chiffres sourcés',
      mentions: 'Mentions légales',
      privacy: 'Politique de confidentialité',
      terms: 'CGU',
      sales: 'CGV',
    },
    card: {
      eyebrow: 'Carte de visite',
      panelTitle: 'Personnalisez et téléchargez.',
      forLabel: 'Pour (optionnel, sur le recto)',
      forPh: 'Prénom du destinataire…',
      seeBack: 'Voir le verso',
      seeFront: 'Voir le recto',
      dlFront: 'Télécharger le recto',
      dlBack: 'Télécharger le verso',
      note: 'Fichier vectoriel · 85 × 54 mm · recto & verso · à ouvrir dans Illustrator, Figma ou chez votre imprimeur.',
      pour: 'Pour',
      role1: 'On vous aide à décider,',
      role2: 'et on construit la suite.',
    },
  },
  en: {
    nav: {
      tabs: {
        '/pourquoi': 'The findings',
        '/methode': 'The method',
        '/offres': 'Offers',
        '/exemple': 'Sample audit',
        '/atelier': 'The workshop',
        '/numerique-responsable': 'Sustainable IT',
        '/a-propos': 'About',
      },
      cta: "Contact me",
      ctaBook: 'Book 30 min',
      menu: 'Menu',
      close: 'Close',
      menuEyebrow: 'Navigation',
      asideEyebrow: 'Shall we talk?',
      asideTitle: 'Shall we take a fresh look at your tools?',
    },
    cta: {
      aria: 'Call to action',
      eyebrow: 'Shall we talk?',
      title: 'What if we took a fresh look at your tools?',
      text: "A first conversation to understand your context, no strings attached. We tell you honestly whether there's something worth doing.",
      primary: 'Talk about your tools',
      secondary: 'Send a message',
    },
    footer: {
      tagline:
        'Digital audit and productivity. We start on the ground, employee by employee, to give you back time.',
      cta: 'Talk about your tools',
      site: 'Site',
      resources: 'Resources',
      contact: 'Contact',
      home: 'Home',
      logo: 'Logo (SVG)',
      card: 'Business card',
      talk: 'Talk about your tools',
      zone: 'Valenciennes and Lille',
      sign: 'We put your tools back in order.',
      rights: 'Consulting & digital engineering',
      meta: 'Open process · clear scope · sourced figures',
      mentions: 'Legal notice',
      privacy: 'Privacy policy',
      terms: 'Terms of use',
      sales: 'Terms of sale',
    },
    card: {
      eyebrow: 'Business card',
      panelTitle: 'Personalize and download.',
      forLabel: 'For (optional, on the front)',
      forPh: 'Recipient first name…',
      seeBack: 'See the back',
      seeFront: 'See the front',
      dlFront: 'Download the front',
      dlBack: 'Download the back',
      note: 'Vector file · 85 × 54 mm · front & back · open in Illustrator, Figma or at your printer.',
      pour: 'For',
      role1: 'Consulting & digital engineering',
      role2: 'Web development · automation',
    },
  },
};

/* Le site ne parle plus qu'une langue. La version anglaise traduisait mot
   à mot un discours écrit pour des dirigeants des Hauts-de-France : elle
   doublait le travail à chaque phrase et ne servait personne. Le contexte
   reste, pour que les composants qui lisent encore la langue n'aient rien
   à changer ; il répond toujours « fr ». */
const LangContext = createContext({ lang: 'fr', setLang: () => {}, t: SHARED.fr });

export function LangProvider({ children }) {
  useEffect(() => {
    document.documentElement.lang = 'fr';
    /* Une préférence laissée par l'ancienne version du site n'a plus de
       raison de rester dans le navigateur du visiteur. */
    try {
      localStorage.removeItem('reskope-lang');
      localStorage.removeItem('reskope-profil');
      sessionStorage.removeItem('reskope-porte-vue');
    } catch {
      /* navigation privée */
    }
  }, []);

  const setLang = useCallback(() => {}, []);

  return (
    <LangContext.Provider value={{ lang: 'fr', setLang, t: SHARED.fr }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  return { lang, setLang };
}

export function useT() {
  return useContext(LangContext).t;
}
