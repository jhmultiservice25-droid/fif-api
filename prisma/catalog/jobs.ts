import type { Job } from "@prisma/client";

export const JOBS = [
  {
    id: "coordonnateur-general",
    slug: "coordonnateur-general",
    title: "Coordonnateur général FIF",
    poleId: "coordination",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Assurer le leadership général du FIKIRI Innovation Festival 2026, arbitrer les priorités, représenter le Comité et rendre compte au Comité de pilotage.",
    responsibilities: [
      "Piloter l’ensemble du Comité d’organisation et garantir l’alignement des pôles.",
      "Arbitrer les décisions transversales, risques et blocages critiques.",
      "Représenter le Festival auprès des partenaires, autorités et parties prenantes.",
      "Superviser l’exécution du Festival du 25 au 27 novembre 2026 et le suivi post-FIF.",
    ],
    profile: [
      "Leadership confirmé en coordination de projets complexes ou d’événements.",
      "Capacité d’arbitrage, de représentation institutionnelle et de gestion multi-équipes.",
      "Forte disponibilité jusqu’à la clôture opérationnelle du FIF 2026.",
    ],
  },
  {
    id: "adjoint-coordination",
    slug: "adjoint-coordination",
    title: "Coordonnateur général adjoint / Event Manager",
    poleId: "coordination",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Appuyer le Coordonnateur général dans le pilotage opérationnel du Festival, l’alignement des pôles et la tenue du calendrier jusqu’au Festival du 25 au 27 novembre 2026.",
    responsibilities: [
      "Tenir le calendrier maître et les points de coordination inter-pôles.",
      "Anticiper les blocages, arbitrer les priorités et relayer les décisions.",
      "Superviser la production de l’événement en lien avec la logistique et le PMO.",
      "Assurer la continuité opérationnelle en l’absence du Coordonnateur général.",
    ],
    profile: [
      "Expérience confirmée en coordination d’événements ou de projets multi-équipes.",
      "Capacité de décision, rigueur et aisance relationnelle.",
      "Disponibilité intensive de septembre à fin novembre 2026.",
    ],
  },
  {
    id: "charge-coordination",
    slug: "charge-coordination",
    title: "Deputy / Chargé Coordination & Event Management",
    poleId: "coordination",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Assister le Coordonnateur général adjoint dans le suivi quotidien, la logistique de coordination et la préparation des instances de décision.",
    responsibilities: [
      "Préparer les réunions de coordination et en assurer le suivi.",
      "Centraliser les informations venant des pôles.",
      "Appuyer la production des briefs et des comptes rendus.",
    ],
    profile: [
      "Organisation, discrétion et aisance à l’écrit.",
      "Expérience en assistance de projet ou d’événementiel souhaitée.",
    ],
  },
  {
    id: "responsable-zone-operationnelle",
    slug: "responsable-zone-operationnelle",
    title: "Responsable de zone opérationnelle",
    poleId: "coordination",
    roleKind: "DEPUTY",
    headcount: 20,
    mission:
      "Encadrer une zone opérationnelle du Festival — scène, salles, Village, B2B, accueil, VIP ou autre espace affecté — et servir de relais terrain de la Coordination.",
    responsibilities: [
      "Préparer la zone attribuée et appliquer les check-lists opérationnelles.",
      "Coordonner les équipes et volontaires affectés à la zone.",
      "Faire remonter immédiatement incidents, besoins et arbitrages à la Coordination.",
      "Assurer la continuité du service pendant les trois jours du Festival.",
    ],
    profile: [
      "Expérience terrain en événementiel, opérations, accueil ou coordination d’équipe.",
      "Réactivité, sens du service, ponctualité et capacité à travailler sous pression.",
    ],
  },
  {
    id: "responsable-programme",
    slug: "responsable-programme",
    title: "Responsable Programme & Contenu",
    poleId: "programme",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Concevoir et livrer le programme des 25, 26 et 27 novembre : plénières, FIKIRI Talks, Academy, challenges, Demo Show et Grand Pitch.",
    responsibilities: [
      "Construire la grille horaire et la cohérence éditoriale.",
      "Recruter et briefer les speakers, formateurs et jurys.",
      "Coordonner les salles, masterclasses et contenus scéniques.",
      "Garantir la qualité des contenus et le respect des timings.",
    ],
    profile: [
      "Expérience en programmation d’événements, médias ou pédagogie.",
      "Réseau dans l’écosystème numérique congolais apprécié.",
      "Excellence rédactionnelle et sens du rythme.",
    ],
  },
  {
    id: "charge-programme-speakers",
    slug: "charge-programme-speakers",
    title: "Deputy / Chargé Programme & Speakers",
    poleId: "programme",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Gérer la relation speakers, les briefs et la logistique des interventions sur les scènes FIF.",
    responsibilities: [
      "Tenir le listing speakers et les confirmations.",
      "Préparer les briefs, bio et run of show.",
      "Accueillir les intervenants le jour J.",
    ],
    profile: [
      "Aisance relationnelle et rigueur de suivi.",
      "Intérêt pour l’innovation et la prise de parole publique.",
    ],
  },
  {
    id: "charge-academy",
    slug: "charge-academy",
    title: "Chargé FIKIRI Academy & Masterclasses",
    poleId: "programme",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Organiser les masterclasses du Jour 2 (startup, IA, cybersécurité, MVP, pitch, financement, marque personnelle, data & langues congolaises).",
    responsibilities: [
      "Recruter les formateurs et cadrer les formats pédagogiques.",
      "Gérer les salles, jauges et supports.",
      "Recueillir les retours participants.",
    ],
    profile: [
      "Intérêt pour la formation et les compétences numériques.",
      "Capacité à coordonner plusieurs ateliers en parallèle.",
    ],
  },
  {
    id: "responsable-exposants",
    slug: "responsable-exposants",
    title: "Responsable Exposants & Innovation Village",
    poleId: "exposants",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Faire du FIKIRI Village le lieu où 100+ solutions sont exposées, démontrées et mises en relation avec les décideurs.",
    responsibilities: [
      "Recruter et qualifier les exposants.",
      "Concevoir le plan du Village et les parcours de visite.",
      "Superviser l’installation des stands et des démos.",
      "Assurer l’expérience exposants pendant les trois jours.",
    ],
    profile: [
      "Expérience salons, foires, community ou business development.",
      "Sens de la scénographie et du service.",
    ],
  },
  {
    id: "charge-exposants",
    slug: "charge-exposants",
    title: "Deputy / Chargé Exposants",
    poleId: "exposants",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Suivre le pipeline exposants, les dossiers d’inscription et l’accompagnement jusqu’à l’installation.",
    responsibilities: [
      "Tenir le CRM exposants.",
      "Collecter les besoins techniques des stands.",
      "Coordonner l’accueil des exposants sur site.",
    ],
    profile: [
      "Rigueur administrative et aisance commerciale.",
    ],
  },
  {
    id: "charge-village-demos",
    slug: "charge-village-demos",
    title: "Chargé Innovation Village & Démonstrations",
    poleId: "exposants",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Animer la zone de démonstration, le rythme des démos et l’expérience visiteur du Village.",
    responsibilities: [
      "Planifier les créneaux de démonstration.",
      "Briefer les exposants sur le parcours visiteur.",
      "Coordonner avec la tech et la logistique.",
    ],
    profile: [
      "Sens de l’animation et intérêt pour les produits numériques.",
    ],
  },
  {
    id: "responsable-buyers",
    slug: "responsable-buyers",
    title: "Responsable Buyers, B2B & Market Access",
    poleId: "buyers",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Piloter le Buyers Programme : exprimer les besoins, identifier les solutions locales, organiser les rendez-vous B2B et viser des pilotes.",
    responsibilities: [
      "Mobiliser administrations, entreprises publiques et privées.",
      "Qualifier les besoins numériques avant le Festival.",
      "Organiser le matching et les 300+ rencontres B2B visées.",
      "Suivre les pistes de pilotes et de contrats.",
    ],
    profile: [
      "Expérience B2B, marchés publics, business development ou matching.",
      "Réseau institutionnel et privé apprécié.",
    ],
  },
  {
    id: "charge-b2b",
    slug: "charge-b2b",
    title: "Deputy / Chargé B2B & Matching",
    poleId: "buyers",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Opérer l’agenda B2B, les outils de matching et l’accueil des buyers pendant le Festival.",
    responsibilities: [
      "Construire les agendas de rendez-vous.",
      "Accueillir buyers et fournisseurs sur l’espace B2B.",
      "Tracer les comptes rendus de rencontres.",
    ],
    profile: [
      "Organisation, diplomatie et aisance avec les outils numériques.",
    ],
  },
  {
    id: "responsable-partenariats",
    slug: "responsable-partenariats",
    title: "Responsable Partenariats & Mobilisation des ressources",
    poleId: "partenariats",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Sécuriser les partenariats institutionnels, privés et techniques nécessaires au Festival et à son après.",
    responsibilities: [
      "Cartographier et solliciter les partenaires.",
      "Négocier conventions, contreparties et visibilité.",
      "Suivre les engagements financiers et en nature.",
      "Coordonner le reporting partenaires.",
    ],
    profile: [
      "Expérience fundraising, partenariats ou relations institutionnelles.",
      "Excellence rédactionnelle et relationnelle.",
    ],
  },
  {
    id: "charge-ressources",
    slug: "charge-ressources",
    title: "Deputy / Chargé Mobilisation des ressources",
    poleId: "partenariats",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Appuyer le suivi des dossiers partenaires, des contreparties et de la documentation contractuelle.",
    responsibilities: [
      "Tenir le tableau des engagements.",
      "Préparer notes, dossiers et supports de sollicitation.",
      "Relancer et documenter les échanges.",
    ],
    profile: [
      "Rigueur, discrétion et aisance à l’écrit.",
    ],
  },
  {
    id: "responsable-communication",
    slug: "responsable-communication",
    title: "Responsable Communication & Médias",
    poleId: "communication",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Porter le récit public du FIF 2026, la couverture médiatique et la présence digitale avant, pendant et après le Festival.",
    responsibilities: [
      "Définir le plan de communication et le ton éditorial.",
      "Piloter médias, réseaux sociaux et FIKIRI Studio.",
      "Superviser interviews, photos, vidéos et live.",
      "Assurer la cohérence de marque sur site et en ligne.",
    ],
    profile: [
      "Expérience communication, presse ou production de contenus.",
      "Capacité à diriger une équipe créative sous délai court.",
    ],
  },
  {
    id: "charge-communication",
    slug: "charge-communication",
    title: "Deputy / Chargé Communication digitale",
    poleId: "communication",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Produire et orchestrer les contenus digitaux, le community management et la couverture en temps réel.",
    responsibilities: [
      "Planifier et publier les contenus.",
      "Coordonner les interviews et les formats courts.",
      "Animer les communautés pendant le Festival.",
    ],
    profile: [
      "Maîtrise des réseaux sociaux et du storytelling visuel.",
    ],
  },
  {
    id: "charge-medias",
    slug: "charge-medias",
    title: "Chargé Médias & Presse",
    poleId: "communication",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Gérer les relations presse, l’accueil médias et les kits de communication.",
    responsibilities: [
      "Tenir le fichier presse et les invitations.",
      "Préparer communiqués, dossiers et éléments de langage.",
      "Accueillir les journalistes sur site.",
    ],
    profile: [
      "Expérience relations presse ou journalisme.",
    ],
  },
  {
    id: "responsable-participants",
    slug: "responsable-participants",
    title: "Responsable Participants, Communauté & Volontaires",
    poleId: "participants",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Mobiliser les 2 000+ participants et constituer, former et encadrer le corps des 80 à 100 volontaires FIF 2026.",
    responsibilities: [
      "Piloter les inscriptions et la communauté FIF.",
      "Recruter, sélectionner et affecter les volontaires.",
      "Organiser formations, briefings et présence sur site.",
      "Garantir l’accueil et l’orientation des participants.",
    ],
    profile: [
      "Expérience community, RH événementiel ou gestion de volontaires.",
      "Leadership de terrain et sens du service.",
    ],
  },
  {
    id: "charge-volontaires",
    slug: "charge-volontaires",
    title: "Deputy / Chargé Volontaires",
    poleId: "participants",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Opérer le recrutement, l’affectation, les shifts et le suivi quotidien des volontaires.",
    responsibilities: [
      "Suivre les candidatures et les affectations.",
      "Préparer les listes, badges et briefings.",
      "Être le point de contact terrain des équipes volontaires.",
    ],
    profile: [
      "Organisation, pédagogie et endurance de terrain.",
    ],
  },
  {
    id: "responsable-logistique",
    slug: "responsable-logistique",
    title: "Responsable Logistique & Production",
    poleId: "logistique",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Livrer le site, la production technique, la signalétique et les flux pour un festival de 2 000+ personnes.",
    responsibilities: [
      "Planifier installation, exploitation et démontage.",
      "Coordonner prestataires, matériel et sécurité incendie/site.",
      "Gérer restauration, signalétique et zones fonctionnelles.",
      "Tenir le planning de production avec la coordination.",
    ],
    profile: [
      "Expérience production événementielle ou logistique de site.",
      "Capacité à gérer prestataires et imprévus.",
    ],
  },
  {
    id: "charge-logistique",
    slug: "charge-logistique",
    title: "Deputy / Chargé Logistique & Opérations",
    poleId: "logistique",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Suivre le matériel, les équipes terrain et l’exécution du plan d’installation.",
    responsibilities: [
      "Inventaires, mouvements de matériel, check-lists.",
      "Encadrement des équipes d’installation.",
      "Point de contact opérations pendant le Festival.",
    ],
    profile: [
      "Rigueur, disponibilité physique et calme sous pression.",
    ],
  },
  {
    id: "responsable-technologie",
    slug: "responsable-technologie",
    title: "Responsable Technologie & Digital Experience",
    poleId: "technologie",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Garantir les plateformes FIF, la connectivité, les badges/QR, l’audiovisuel numérique et les expériences immersives.",
    responsibilities: [
      "Piloter les outils d’inscription, check-in et matching.",
      "Superviser réseau, AV et support technique.",
      "Coordonner FIKIRI Experience (IA, immersif, robotique).",
      "Sécuriser les données et la continuité de service.",
    ],
    profile: [
      "Profil tech (produit, infra, AV digital) avec leadership.",
      "Capacité à vulgariser et à prioriser.",
    ],
  },
  {
    id: "charge-digital",
    slug: "charge-digital",
    title: "Deputy / Chargé Digital Experience & Support",
    poleId: "technologie",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Opérer le support numérique, les badges, la connectivité et l’assistance aux scènes et stands.",
    responsibilities: [
      "Déployer et tester les outils de check-in.",
      "Assister exposants et salles sur les besoins tech.",
      "Tenir le hotline technique pendant le Festival.",
    ],
    profile: [
      "Aisance technique, pédagogie et réactivité.",
    ],
  },
  {
    id: "responsable-protocole",
    slug: "responsable-protocole",
    title: "Responsable Protocole, Sécurité & VIP",
    poleId: "protocole",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Garantir l’accueil des autorités, le respect du protocole, la sécurité des personnes et le parcours VIP.",
    responsibilities: [
      "Établir les listes VIP et les scénarios d’accueil.",
      "Coordonner sécurité privée, site et autorités.",
      "Chorégraphier arrivées, cortèges et photo officielle.",
      "Protéger l’expérience des invités institutionnels.",
    ],
    profile: [
      "Expérience protocole, événements officiels ou sécurité événementielle.",
      "Discrétion, diplomatie et sang-froid.",
    ],
  },
  {
    id: "charge-protocole",
    slug: "charge-protocole",
    title: "Deputy / Chargé Protocole & VIP",
    poleId: "protocole",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Exécuter les parcours d’accueil VIP, le briefing des équipes et le suivi des invités sur site.",
    responsibilities: [
      "Tenir les listes et les badges VIP.",
      "Briefer les volontaires protocole.",
      "Accompagner les invités de l’arrivée à la loge.",
    ],
    profile: [
      "Présentation soignée, ponctualité et sens du service.",
    ],
  },
  {
    id: "responsable-pmo",
    slug: "responsable-pmo",
    title: "Responsable PMO — Planification, Suivi & Reporting",
    poleId: "pmo",
    roleKind: "LEAD",
    headcount: 1,
    mission:
      "Tenir le système de planification du Comité : jalons, risques, reporting et aide à la décision.",
    responsibilities: [
      "Maintenir le plan d’ensemble et les tableaux de bord.",
      "Animer le suivi d’avancement des pôles.",
      "Produire les reports pour la coordination et les partenaires.",
      "Documenter décisions et risques.",
    ],
    profile: [
      "Expérience PMO, suivi-évaluation ou gestion de projet.",
      "Maîtrise des outils de suivi et clarté rédactionnelle.",
    ],
  },
  {
    id: "charge-secretariat",
    slug: "charge-secretariat",
    title: "Chargé Secrétariat de coordination",
    poleId: "pmo",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Assurer le secrétariat du Comité : convocations, archives, notes et assistance à la coordination.",
    responsibilities: [
      "Organiser les réunions et les dossiers.",
      "Rédiger comptes rendus et notes de service.",
      "Classer la documentation du Festival.",
    ],
    profile: [
      "Rigueur administrative, discrétion et excellent français écrit.",
    ],
  },
  {
    id: "charge-reporting",
    slug: "charge-reporting",
    title: "Chargé Suivi & Reporting",
    poleId: "pmo",
    roleKind: "DEPUTY",
    headcount: 1,
    mission:
      "Collecter les indicateurs, alimenter les tableaux de bord et préparer les synthèses de pilotage.",
    responsibilities: [
      "Collecter les données auprès des pôles.",
      "Mettre à jour les indicateurs (candidatures, exposants, B2B, etc.).",
      "Préparer les synthèses hebdomadaires.",
    ],
    profile: [
      "Aisance tableurs, esprit d’analyse et ponctualité.",
    ],
  },
] satisfies Job[];
