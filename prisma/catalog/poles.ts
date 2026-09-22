import type { Pole } from "@prisma/client";

export const POLES = [
  {
    id: "coordination",
    slug: "coordination",
    name: "Coordination",
    shortName: "Coordination",
    description:
      "Coordonnateur général adjoint / Event Manager. Pilotage transversal du Festival, alignement des pôles et tenue du calendrier.",
    order: 0,
  },
  {
    id: "programme",
    slug: "programme",
    name: "Pôle 1 — Programme & Contenu",
    shortName: "Programme & Contenu",
    description:
      "Conception du programme, speakers, FIKIRI Talks, Academy, challenges et cohérence éditoriale des deux jours.",
    order: 1,
  },
  {
    id: "exposants",
    slug: "exposants",
    name: "Pôle 2 — Exposants & Innovation Village",
    shortName: "Exposants & Innovation Village",
    description:
      "Recrutement et accompagnement des exposants, scénographie du Village et démonstrations de solutions.",
    order: 2,
  },
  {
    id: "buyers",
    slug: "buyers",
    name: "Pôle 3 — Buyers, B2B & Market Access",
    shortName: "Buyers, B2B & Market Access",
    description:
      "Programme Buyers, matching besoins/solutions, rendez-vous B2B et accès au marché.",
    order: 3,
  },
  {
    id: "partenariats",
    slug: "partenariats",
    name: "Pôle 4 — Partenariats & Mobilisation des ressources",
    shortName: "Partenariats & Ressources",
    description:
      "Partenaires institutionnels et privés, sponsoring, conventions et mobilisation des ressources.",
    order: 4,
  },
  {
    id: "communication",
    slug: "communication",
    name: "Pôle 5 — Communication & Médias",
    shortName: "Communication & Médias",
    description:
      "Récit public du Festival, médias, réseaux sociaux, FIKIRI Studio et couverture des deux jours.",
    order: 5,
  },
  {
    id: "participants",
    slug: "participants",
    name: "Pôle 6 — Participants, Communauté & Volontaires",
    shortName: "Participants & Volontaires",
    description:
      "Inscriptions, communauté FIF, mobilisation et encadrement des volontaires.",
    order: 6,
  },
  {
    id: "logistique",
    slug: "logistique",
    name: "Pôle 7 — Logistique & Production",
    shortName: "Logistique & Production",
    description:
      "Site, signalétique, production technique, flux, restauration et tenue opérationnelle du Festival.",
    order: 7,
  },
  {
    id: "technologie",
    slug: "technologie",
    name: "Pôle 8 — Technologie & Digital Experience",
    shortName: "Technologie & Digital",
    description:
      "Plateformes FIF, badges, connectivité, expériences numériques et support technique.",
    order: 8,
  },
  {
    id: "protocole",
    slug: "protocole",
    name: "Pôle 9 — Protocole, Sécurité & VIP",
    shortName: "Protocole, Sécurité & VIP",
    description:
      "Accueil des autorités, protocole, sécurité des personnes et parcours VIP.",
    order: 9,
  },
  {
    id: "pmo",
    slug: "pmo",
    name: "PMO / Secrétariat de coordination",
    shortName: "PMO & Secrétariat",
    description:
      "Planification, suivi, reporting et assistance à la coordination générale.",
    order: 10,
  },
] satisfies Pole[];
