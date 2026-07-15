import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import { CONTACT } from '../data/site';

/* Pages légales : mentions, confidentialité, CGU, CGV.
   Sobres et lisibles (prose), même squelette pour les quatre.

   ⚠️ À FINALISER avant mise en ligne réelle : les champs marqués
   [À COMPLÉTER : …] attendent tes informations d'entreprise (forme
   juridique, SIRET, adresse, régime de TVA, éventuel médiateur, date). */

function LegalPage({ meta, eyebrow, title, lead, sections, updated }) {
  return (
    <Page title={meta} description={lead}>
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} />
      <section className="section section--tight">
        <div className="container legal">
          {sections.map((s) => (
            <Reveal key={s.h} amount={0.05}>
              <RevealItem as="div" className="legal__block">
                <h2>{s.h}</h2>
                {s.p.map((para, i) => <p key={i}>{para}</p>)}
              </RevealItem>
            </Reveal>
          ))}
          {updated && (
            <Reveal amount={0.05}>
              <RevealItem as="p" className="legal__updated">{updated}</RevealItem>
            </Reveal>
          )}
        </div>
      </section>
    </Page>
  );
}

/* ————————————————— Mentions légales ————————————————— */
const MENTIONS = {
  fr: {
    meta: 'Mentions légales · Reskope',
    eyebrow: 'Informations',
    title: 'Mentions légales.',
    lead: "Les informations légales relatives à l'éditeur et à l'hébergement de ce site.",
    updated: 'Dernière mise à jour : [À COMPLÉTER : date].',
    sections: [
      { h: 'Éditeur du site', p: [
        `Le site Reskope est édité par Florian Bouchart, [À COMPLÉTER : forme juridique — ex. entrepreneur individuel / micro-entreprise].`,
        'Siège : [À COMPLÉTER : adresse du siège].',
        'SIRET : [À COMPLÉTER : n° SIRET] · Code APE : [À COMPLÉTER : code APE].',
        'TVA : [À COMPLÉTER : « TVA non applicable, art. 293 B du CGI » en franchise en base, ou n° de TVA intracommunautaire si assujetti].',
        `Contact : ${CONTACT.email}`,
      ] },
      { h: 'Directeur de la publication', p: [
        'Directeur de la publication : Florian Bouchart.',
      ] },
      { h: 'Hébergement', p: [
        'Le site est hébergé par GitHub, Inc. (service GitHub Pages), 88 Colin P. Kelly Jr Street, San Francisco, CA 94107, États-Unis · pages.github.com',
      ] },
      { h: 'Propriété intellectuelle', p: [
        "L'ensemble des contenus de ce site (textes, identité visuelle, logo, animations, code) est la propriété de Reskope, sauf mention contraire. Toute reproduction, représentation, modification ou adaptation, totale ou partielle, sans autorisation écrite préalable, est interdite et constitue une contrefaçon.",
      ] },
      { h: 'Données personnelles', p: [
        `Les traitements de données personnelles réalisés via ce site (formulaires de contact, questionnaire) sont détaillés dans la politique de confidentialité. Pour toute question ou pour exercer vos droits : ${CONTACT.email}`,
      ] },
      { h: 'Cookies', p: [
        "Ce site n'utilise aucun cookie de suivi ou de publicité. Voir la politique de confidentialité pour le détail.",
      ] },
      { h: 'Responsabilité', p: [
        "Reskope s'efforce d'assurer l'exactitude des informations publiées, sans pouvoir la garantir. Les liens externes sont fournis à titre informatif : Reskope n'est pas responsable de leur contenu.",
      ] },
      { h: 'Droit applicable', p: [
        "Le présent site est soumis au droit français. À défaut de résolution amiable, les tribunaux français sont seuls compétents.",
      ] },
    ],
  },
  en: {
    meta: 'Legal notice · Reskope',
    eyebrow: 'Information',
    title: 'Legal notice.',
    lead: 'Legal information about the publisher and hosting of this site.',
    updated: 'Last updated: [TO COMPLETE: date].',
    sections: [
      { h: 'Publisher', p: [
        'The Reskope website is published by Florian Bouchart, [TO COMPLETE: legal form — e.g. sole proprietor / micro-enterprise].',
        'Registered address: [TO COMPLETE: registered address].',
        'SIRET: [TO COMPLETE: SIRET number] · APE code: [TO COMPLETE: APE code].',
        'VAT: [TO COMPLETE: "VAT not applicable, art. 293 B of the French Tax Code" under the franchise scheme, or intra-community VAT number if liable].',
        `Contact: ${CONTACT.email}`,
      ] },
      { h: 'Publication director', p: [
        'Publication director: Florian Bouchart.',
      ] },
      { h: 'Hosting', p: [
        'The site is hosted by GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr Street, San Francisco, CA 94107, USA · pages.github.com',
      ] },
      { h: 'Intellectual property', p: [
        'All content on this site (texts, visual identity, logo, animations, code) is the property of Reskope unless stated otherwise. Any reproduction, representation, modification or adaptation, in whole or in part, without prior written consent, is prohibited and constitutes infringement.',
      ] },
      { h: 'Personal data', p: [
        `Personal data processing carried out through this site (contact forms, questionnaire) is detailed in the privacy policy. For any question or to exercise your rights: ${CONTACT.email}`,
      ] },
      { h: 'Cookies', p: [
        'This site uses no tracking or advertising cookies. See the privacy policy for details.',
      ] },
      { h: 'Liability', p: [
        'Reskope strives to keep the published information accurate but cannot guarantee it. External links are provided for information only: Reskope is not responsible for their content.',
      ] },
      { h: 'Applicable law', p: [
        'This site is governed by French law. Failing an amicable resolution, French courts have exclusive jurisdiction.',
      ] },
    ],
  },
};

/* ————————————————— Confidentialité ————————————————— */
const PRIVACY = {
  fr: {
    meta: 'Politique de confidentialité · Reskope',
    eyebrow: 'Vos données',
    title: 'Politique de confidentialité.',
    lead: 'Ce que ce site collecte (très peu), pourquoi, où vont vos données, et vos droits.',
    updated: 'Dernière mise à jour : [À COMPLÉTER : date].',
    sections: [
      { h: 'Responsable du traitement', p: [
        `Le responsable du traitement est Florian Bouchart (Reskope), [À COMPLÉTER : adresse]. Pour toute question relative à vos données : ${CONTACT.email}`,
      ] },
      { h: 'Données collectées', p: [
        "Ce site ne demande la création d'aucun compte et n'utilise aucun outil de suivi publicitaire ni de mesure d'audience. Les seules données personnelles collectées sont celles que vous transmettez volontairement via les formulaires de contact et le questionnaire : nom, adresse e-mail et contenu de votre message.",
        'Une préférence technique (la langue choisie) est enregistrée localement dans votre navigateur (localStorage) et ne quitte jamais votre appareil.',
      ] },
      { h: 'Finalités et bases légales', p: [
        "Vos données servent uniquement à traiter et répondre à votre demande (mesures précontractuelles et intérêt légitime à échanger avec vous), et à assurer le suivi de nos éventuels échanges commerciaux.",
        "L'envoi d'un message via un formulaire vaut consentement à ce traitement. Vous pouvez retirer ce consentement à tout moment.",
      ] },
      { h: 'Destinataires et transfert hors UE', p: [
        "Les messages des formulaires sont acheminés par le service FormSubmit (opéré depuis les États-Unis), qui transmet votre message par e-mail sans le stocker durablement. À ce titre, vos données transitent hors de l'Union européenne ; ce transfert est encadré par les garanties contractuelles du prestataire.",
        "L'hébergement du site est assuré par GitHub, Inc. (États-Unis). Vos données ne sont ni vendues ni cédées à des fins commerciales, et ne sont partagées avec aucun autre tiers que les prestataires techniques strictement nécessaires ci-dessus.",
      ] },
      { h: 'Durée de conservation', p: [
        "Vos messages sont conservés le temps de l'échange, puis au maximum 3 ans après le dernier contact, avant suppression.",
      ] },
      { h: 'Sécurité', p: [
        "Le site est servi en HTTPS. Des mesures raisonnables sont prises pour protéger vos données contre tout accès non autorisé ; aucune transmission sur Internet ne peut toutefois être garantie à 100 %.",
      ] },
      { h: 'Vos droits', p: [
        `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité sur vos données, ainsi que du droit de retirer votre consentement. Pour l'exercer : ${CONTACT.email}`,
        "Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).",
      ] },
      { h: 'Cookies', p: [
        "Ce site n'utilise aucun cookie de suivi ou de publicité. La seule information stockée localement est votre préférence de langue (localStorage), qui ne nécessite pas de consentement et ne quitte pas votre appareil.",
      ] },
      { h: 'Mise à jour', p: [
        "Cette politique peut être mise à jour pour refléter des évolutions légales ou techniques. La date de dernière mise à jour figure ci-dessous.",
      ] },
    ],
  },
  en: {
    meta: 'Privacy policy · Reskope',
    eyebrow: 'Your data',
    title: 'Privacy policy.',
    lead: 'What this site collects (very little), why, where your data goes, and your rights.',
    updated: 'Last updated: [TO COMPLETE: date].',
    sections: [
      { h: 'Data controller', p: [
        `The data controller is Florian Bouchart (Reskope), [TO COMPLETE: address]. For any question about your data: ${CONTACT.email}`,
      ] },
      { h: 'Data collected', p: [
        'This site requires no account and uses no advertising trackers or analytics. The only personal data collected is what you voluntarily submit through the contact forms and the questionnaire: name, email address and the content of your message.',
        'A technical preference (your chosen language) is stored locally in your browser (localStorage) and never leaves your device.',
      ] },
      { h: 'Purpose and legal basis', p: [
        'Your data is used solely to handle and answer your request (pre-contractual steps and legitimate interest in talking with you) and to follow up on any exchanges.',
        'Sending a message through a form constitutes consent to this processing. You may withdraw that consent at any time.',
      ] },
      { h: 'Recipients and transfer outside the EU', p: [
        'Form messages are routed through the FormSubmit service (operated from the United States), which forwards your message by email without storing it durably. As a result, your data transits outside the European Union; this transfer is governed by the provider’s contractual safeguards.',
        'The site is hosted by GitHub, Inc. (United States). Your data is neither sold nor transferred for commercial purposes, and is not shared with any third party other than the strictly necessary technical providers above.',
      ] },
      { h: 'Retention', p: [
        'Your messages are kept for the duration of the exchange, then at most 3 years after the last contact, before deletion.',
      ] },
      { h: 'Security', p: [
        'The site is served over HTTPS. Reasonable measures are taken to protect your data against unauthorized access; no transmission over the Internet can, however, be guaranteed 100%.',
      ] },
      { h: 'Your rights', p: [
        `Under the GDPR, you have the right to access, rectify, erase, restrict, object to and port your data, as well as the right to withdraw your consent. To exercise it: ${CONTACT.email}`,
        'You may also lodge a complaint with the French authority, the CNIL (cnil.fr).',
      ] },
      { h: 'Cookies', p: [
        'This site uses no tracking or advertising cookies. The only information stored locally is your language preference (localStorage), which requires no consent and does not leave your device.',
      ] },
      { h: 'Updates', p: [
        'This policy may be updated to reflect legal or technical changes. The date of the last update appears below.',
      ] },
    ],
  },
};

/* ————————————————— CGU ————————————————— */
const TERMS = {
  fr: {
    meta: "Conditions générales d'utilisation · Reskope",
    eyebrow: 'Cadre',
    title: "Conditions générales d'utilisation.",
    lead: "Les règles simples qui encadrent l'utilisation de ce site.",
    updated: 'Dernière mise à jour : [À COMPLÉTER : date].',
    sections: [
      { h: 'Objet', p: [
        "Les présentes conditions encadrent l'accès et l'utilisation du site Reskope, site vitrine présentant les services d'audit, de conseil et d'ingénierie numérique proposés par Reskope. En utilisant le site, vous acceptez ces conditions.",
      ] },
      { h: 'Accès au site', p: [
        "Le site est accessible gratuitement, 24 h/24 dans la mesure du possible. Reskope ne saurait être tenu responsable d'une indisponibilité temporaire (maintenance, hébergeur, force majeure).",
      ] },
      { h: 'Utilisation', p: [
        "Vous vous engagez à utiliser le site conformément à sa destination et à ne pas tenter d'en perturber le fonctionnement, d'en extraire massivement le contenu ou d'en compromettre la sécurité. Les informations transmises via les formulaires doivent être exactes.",
      ] },
      { h: 'Propriété intellectuelle', p: [
        'Les contenus du site (textes, identité visuelle, logo, animations, code) restent la propriété exclusive de Reskope. Voir les mentions légales pour le détail.',
      ] },
      { h: 'Liens externes', p: [
        "Le site peut renvoyer vers des sites tiers (sources, ressources). Reskope n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
      ] },
      { h: 'Données personnelles', p: [
        'Le traitement des données transmises via le site est décrit dans la politique de confidentialité.',
      ] },
      { h: 'Modification des conditions', p: [
        "Reskope peut modifier les présentes conditions à tout moment. La version applicable est celle en ligne au moment de votre visite.",
      ] },
      { h: 'Droit applicable', p: [
        'Les présentes conditions sont soumises au droit français.',
      ] },
    ],
  },
  en: {
    meta: 'Terms of use · Reskope',
    eyebrow: 'Framework',
    title: 'Terms of use.',
    lead: 'The simple rules governing the use of this site.',
    updated: 'Last updated: [TO COMPLETE: date].',
    sections: [
      { h: 'Purpose', p: [
        'These terms govern access to and use of the Reskope website, a showcase site presenting the audit, consulting and digital engineering services offered by Reskope. By using the site, you accept these terms.',
      ] },
      { h: 'Access', p: [
        'The site is freely accessible, 24/7 whenever possible. Reskope cannot be held liable for temporary unavailability (maintenance, hosting, force majeure).',
      ] },
      { h: 'Use', p: [
        'You agree to use the site for its intended purpose and not to attempt to disrupt its operation, mass-extract its content or compromise its security. Information submitted through the forms must be accurate.',
      ] },
      { h: 'Intellectual property', p: [
        'The contents of the site (texts, visual identity, logo, animations, code) remain the exclusive property of Reskope. See the legal notice for details.',
      ] },
      { h: 'External links', p: [
        'The site may link to third-party sites (sources, resources). Reskope has no control over these sites and disclaims any responsibility for their content.',
      ] },
      { h: 'Personal data', p: [
        'The processing of data submitted through the site is described in the privacy policy.',
      ] },
      { h: 'Changes to the terms', p: [
        'Reskope may amend these terms at any time. The applicable version is the one online at the time of your visit.',
      ] },
      { h: 'Applicable law', p: [
        'These terms are governed by French law.',
      ] },
    ],
  },
};

/* ————————————————— CGV ————————————————— */
const SALES = {
  fr: {
    meta: 'Conditions générales de vente · Reskope',
    eyebrow: 'Prestations',
    title: 'Conditions générales de vente.',
    lead: "Le cadre des prestations d'audit, de mise en œuvre, de développement et de suivi.",
    updated: 'Dernière mise à jour : [À COMPLÉTER : date].',
    sections: [
      { h: 'Objet et champ d’application', p: [
        "Les présentes conditions générales de vente (CGV) régissent les prestations de conseil, d'audit numérique, de développement, d'automatisation et de suivi fournies par Reskope à ses clients professionnels. Toute commande implique l'acceptation sans réserve des présentes CGV, qui prévalent sur tout autre document du client.",
      ] },
      { h: 'Prestataire', p: [
        'Reskope — Florian Bouchart, [À COMPLÉTER : forme juridique, SIRET, adresse]. Coordonnées complètes dans les mentions légales.',
      ] },
      { h: 'Prestations', p: [
        "Reskope propose quatre types de prestations : l'audit numérique (diagnostic terrain et bilan priorisé), l'audit assorti de la mise en œuvre, le développement et l'automatisation sur-mesure, et le suivi mensuel. Le périmètre précis de chaque mission est défini au devis.",
      ] },
      { h: 'Devis et formation du contrat', p: [
        "Chaque mission fait l'objet d'un devis personnalisé, gratuit et sans engagement. Les prix affichés sur le site sont indicatifs (« à partir de ») et ne constituent pas une offre ferme. Le contrat est formé à l'acceptation écrite du devis par le client (signature ou accord par e-mail).",
      ] },
      { h: 'Prix et TVA', p: [
        "Les prix sont exprimés en euros. Le tarif de référence est de 450 € par jour d'intervention, sauf forfait précisé au devis (par exemple l'audit ou l'abonnement de suivi).",
        'TVA : [À COMPLÉTER : « TVA non applicable, art. 293 B du CGI » en franchise en base, ou taux de TVA applicable].',
      ] },
      { h: 'Modalités et délais de paiement', p: [
        'Paiement par virement bancaire. [À COMPLÉTER : acompte à la commande, ex. 30 % ; solde à la livraison ou selon l’échéancier du devis].',
        'Délai de règlement : [À COMPLÉTER : ex. 30 jours à réception de facture]. En cas de retard, des pénalités égales à trois fois le taux d’intérêt légal sont dues de plein droit, ainsi qu’une indemnité forfaitaire de recouvrement de 40 € (art. L441-10 et D441-5 du Code de commerce).',
      ] },
      { h: 'Exécution et délais', p: [
        "Reskope est tenue à une obligation de moyens. Les délais annoncés sont indicatifs et dépendent notamment de la disponibilité du client et de la fourniture des éléments nécessaires. Chaque journée de réalisation est estimée avant démarrage et tracée avec le client.",
      ] },
      { h: 'Obligations du client', p: [
        "Le client s'engage à fournir en temps utile les informations, accès et contenus nécessaires, à désigner un interlocuteur, et à valider les étapes clés. Un défaut de collaboration peut décaler les délais sans engager la responsabilité de Reskope.",
      ] },
      { h: 'Réception des livrables', p: [
        "À défaut de réserve écrite formulée sous [À COMPLÉTER : ex. 10 jours] à compter de la livraison, les livrables sont réputés acceptés.",
      ] },
      { h: 'Propriété intellectuelle', p: [
        "Sauf mention contraire au devis, les droits sur les livrables sur-mesure sont cédés au client après paiement intégral de la mission. Les outils, briques logicielles génériques, méthodes et savoir-faire préexistants de Reskope restent sa propriété. Les composants open-source ou tiers conservent leur licence propre.",
      ] },
      { h: 'Confidentialité', p: [
        "Chaque partie s'engage à garder confidentielles les informations non publiques échangées dans le cadre de la mission, pendant celle-ci et après son terme.",
      ] },
      { h: 'Protection des données', p: [
        "Lorsque, dans le cadre d'une mission, Reskope traite des données personnelles pour le compte du client, elle agit en qualité de sous-traitant au sens de l'article 28 du RGPD, dans le cadre d'un accord de traitement dédié précisant finalités, durées et mesures de sécurité.",
      ] },
      { h: 'Garantie et responsabilité', p: [
        "Reskope répond des défauts de conformité imputables à ses prestations. Sa responsabilité est limitée aux dommages directs et prévisibles, et plafonnée au montant hors taxes effectivement payé pour la mission concernée. Sont exclus les dommages indirects (perte d'exploitation, de données, de chiffre d'affaires).",
      ] },
      { h: 'Force majeure', p: [
        "Aucune partie ne saurait être tenue responsable d'un manquement dû à un cas de force majeure au sens de l'article 1218 du Code civil.",
      ] },
      { h: 'Durée et résiliation', p: [
        "Les missions ponctuelles prennent fin à la livraison. Le suivi mensuel est sans engagement de durée, résiliable à tout moment par chaque partie moyennant un préavis de [À COMPLÉTER : ex. 30 jours], les prestations en cours restant dues.",
      ] },
      { h: 'Droit de rétractation', p: [
        "Les prestations s'adressent à des clients professionnels agissant dans le cadre de leur activité : le droit de rétractation prévu pour les consommateurs ne s'applique en principe pas. Le cas échéant, il peut s'appliquer au professionnel employant cinq salariés ou moins lorsque l'objet de la prestation n'entre pas dans le champ de son activité principale (art. L221-3 du Code de la consommation).",
      ] },
      { h: 'Réclamations et médiation', p: [
        `Toute réclamation peut être adressée à ${CONTACT.email}. [À COMPLÉTER : en cas de clientèle consommateur, coordonnées du médiateur de la consommation compétent].`,
      ] },
      { h: 'Litiges et droit applicable', p: [
        "Les présentes CGV sont soumises au droit français. En cas de différend, les parties rechercheront une solution amiable avant toute action ; à défaut, les tribunaux français seront compétents.",
      ] },
    ],
  },
  en: {
    meta: 'Terms of sale · Reskope',
    eyebrow: 'Services',
    title: 'Terms of sale.',
    lead: 'The framework for audit, delivery, development and retainer engagements.',
    updated: 'Last updated: [TO COMPLETE: date].',
    sections: [
      { h: 'Purpose and scope', p: [
        'These terms of sale govern the consulting, digital audit, development, automation and retainer services provided by Reskope to its professional clients. Any order implies unreserved acceptance of these terms, which prevail over any other document from the client.',
      ] },
      { h: 'Provider', p: [
        'Reskope — Florian Bouchart, [TO COMPLETE: legal form, SIRET, address]. Full details in the legal notice.',
      ] },
      { h: 'Services', p: [
        'Reskope offers four types of engagement: the digital audit (on-site diagnosis and prioritized report), the audit combined with delivery, custom development and automation, and the monthly retainer. The precise scope of each engagement is defined in the quote.',
      ] },
      { h: 'Quote and formation of the contract', p: [
        'Each engagement is covered by a personalised, free and non-binding quote. Prices shown on the site are indicative ("from") and do not constitute a firm offer. The contract is formed upon the client’s written acceptance of the quote (signature or agreement by email).',
      ] },
      { h: 'Price and VAT', p: [
        'Prices are in euros. The reference rate is €450 per day of work, unless a fixed package is stated in the quote (e.g. the audit or the retainer).',
        'VAT: [TO COMPLETE: "VAT not applicable, art. 293 B of the French Tax Code" under the franchise scheme, or applicable VAT rate].',
      ] },
      { h: 'Payment terms', p: [
        'Payment by bank transfer. [TO COMPLETE: deposit on order, e.g. 30%; balance on delivery or per the quote schedule].',
        'Payment term: [TO COMPLETE: e.g. 30 days from invoice]. In case of late payment, penalties equal to three times the legal interest rate are due as of right, plus a fixed recovery indemnity of €40 (art. L441-10 and D441-5 of the French Commercial Code).',
      ] },
      { h: 'Performance and timelines', p: [
        'Reskope is bound by an obligation of means. Stated timelines are indicative and depend notably on the client’s availability and provision of the required materials. Every delivery day is estimated before starting and tracked with the client.',
      ] },
      { h: 'Client obligations', p: [
        'The client undertakes to provide the necessary information, access and content in good time, to designate a point of contact, and to validate key steps. A lack of cooperation may shift timelines without engaging Reskope’s liability.',
      ] },
      { h: 'Acceptance of deliverables', p: [
        'Failing written reservations made within [TO COMPLETE: e.g. 10 days] of delivery, deliverables are deemed accepted.',
      ] },
      { h: 'Intellectual property', p: [
        'Unless stated otherwise in the quote, rights to custom deliverables are transferred to the client after full payment of the engagement. Reskope’s pre-existing tools, generic software components, methods and know-how remain its property. Open-source or third-party components keep their own licence.',
      ] },
      { h: 'Confidentiality', p: [
        'Each party undertakes to keep confidential the non-public information exchanged in the course of the engagement, during it and after its term.',
      ] },
      { h: 'Data protection', p: [
        'Where, in the course of an engagement, Reskope processes personal data on behalf of the client, it acts as a processor within the meaning of Article 28 of the GDPR, under a dedicated processing agreement specifying purposes, durations and security measures.',
      ] },
      { h: 'Warranty and liability', p: [
        'Reskope is liable for non-conformities attributable to its services. Its liability is limited to direct and foreseeable damages, and capped at the pre-tax amount actually paid for the engagement concerned. Indirect damages (loss of business, data or revenue) are excluded.',
      ] },
      { h: 'Force majeure', p: [
        'Neither party may be held liable for a failure due to force majeure within the meaning of Article 1218 of the French Civil Code.',
      ] },
      { h: 'Term and termination', p: [
        'One-off engagements end on delivery. The monthly retainer has no fixed term and may be terminated at any time by either party with [TO COMPLETE: e.g. 30 days] notice, with work in progress remaining due.',
      ] },
      { h: 'Right of withdrawal', p: [
        'Services are aimed at professional clients acting within their business: the right of withdrawal provided for consumers does not, in principle, apply. Where applicable, it may apply to a professional employing five staff or fewer where the subject of the service does not fall within their main activity (art. L221-3 of the French Consumer Code).',
      ] },
      { h: 'Complaints and mediation', p: [
        `Any complaint may be sent to ${CONTACT.email}. [TO COMPLETE: for consumer clients, details of the competent consumer mediator].`,
      ] },
      { h: 'Disputes and applicable law', p: [
        'These terms of sale are governed by French law. In the event of a dispute, the parties will seek an amicable solution before any action; failing that, French courts have jurisdiction.',
      ] },
    ],
  },
};

export function MentionsLegales() {
  const { lang } = useLang();
  return <LegalPage key={lang} {...MENTIONS[lang]} />;
}

export function Confidentialite() {
  const { lang } = useLang();
  return <LegalPage key={lang} {...PRIVACY[lang]} />;
}

export function CGU() {
  const { lang } = useLang();
  return <LegalPage key={lang} {...TERMS[lang]} />;
}

export function CGV() {
  const { lang } = useLang();
  return <LegalPage key={lang} {...SALES[lang]} />;
}
