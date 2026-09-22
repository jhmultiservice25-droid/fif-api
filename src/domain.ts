export const COMMITTEE_STATUSES = [
  "RECEIVED",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
] as const;

export type CommitteeStatus = (typeof COMMITTEE_STATUSES)[number];

export const VOLUNTEER_STATUSES = [
  "RECEIVED",
  "SHORTLISTED",
  "SELECTED",
  "WAITLIST",
  "REJECTED",
  "ASSIGNED",
  "TRAINED",
] as const;

export type VolunteerStatus = (typeof VOLUNTEER_STATUSES)[number];

export const APPLICATION_KINDS = ["COMMITTEE", "VOLUNTEER"] as const;
export type ApplicationKind = (typeof APPLICATION_KINDS)[number];

export const COMMITTEE_STATUS_LABELS: Record<CommitteeStatus, string> = {
  RECEIVED: "Reçu",
  SHORTLISTED: "Présélectionné",
  INTERVIEW: "Entretien",
  SELECTED: "Sélectionné",
  REJECTED: "Non retenu",
};

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatus, string> = {
  RECEIVED: "Reçu",
  SHORTLISTED: "Présélectionné",
  SELECTED: "Sélectionné",
  WAITLIST: "Liste d'attente",
  REJECTED: "Non retenu",
  ASSIGNED: "Affecté",
  TRAINED: "Formé",
};

export const SEX_OPTIONS = ["FEMME", "HOMME", "AUTRE"] as const;
export const EDUCATION_LEVELS = [
  "SECONDAIRE",
  "LICENCE",
  "MASTER",
  "DOCTORAT",
  "AUTRE",
] as const;
export const PROFESSIONAL_SITUATIONS = [
  "ETUDIANT",
  "SALARIE",
  "INDEPENDANT",
  "CHERCHEUR_EMPLOI",
  "BENEVOLE",
  "AUTRE",
] as const;

export const VOLUNTEER_TEAMS = [
  { id: "accueil", name: "Accueil & Orientation" },
  { id: "registration", name: "Registration & Badges" },
  { id: "village", name: "Innovation Village" },
  { id: "programme", name: "Programme, Salles & Masterclasses" },
  { id: "b2b", name: "B2B & Networking" },
  { id: "communication", name: "Communication & Social Media" },
  { id: "studio", name: "Photo, Vidéo & FIKIRI Studio" },
  { id: "tech", name: "Tech Support" },
  { id: "protocole", name: "Protocole & VIP" },
  { id: "logistique", name: "Logistique & Operations" },
] as const;

export const VOLUNTEER_MOTIVATION_MAX_WORDS = 150;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export type ApplicationListItem = {
  id: string;
  kind: ApplicationKind;
  fullName: string;
  email: string;
  whatsapp: string;
  city: string;
  status: CommitteeStatus | VolunteerStatus;
  primaryChoice: string;
  secondaryChoice?: string;
  createdAt: string;
};

export type AdminStats = {
  committeeTotal: number;
  volunteerTotal: number;
  committeeByStatus: Record<string, number>;
  volunteerByStatus: Record<string, number>;
  committeeByJob: { jobId: string; title: string; poleId: string; count: number }[];
  volunteerByTeam: { teamId: string; name: string; count: number }[];
  byDay: { date: string; committee: number; volunteer: number }[];
  thisWeek: number;
  lastWeek: number;
};

export const USER_ROLES = ["ADMIN", "ORGANIZATION", "INNOVATOR"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const RECORD_STATUSES = ["DRAFT", "SUBMITTED"] as const;
export type RecordStatus = (typeof RECORD_STATUSES)[number];

export const PUBLICATION_CONSENTS = ["NAMED", "ANONYMOUS", "NO", "DISCUSS"] as const;
export type PublicationConsent = (typeof PUBLICATION_CONSENTS)[number];

export const ORG_TYPES = [
  "ADMINISTRATION_PUBLIQUE",
  "MINISTERE_SERVICE_PUBLIC",
  "ENTREPRISE_PUBLIQUE",
  "ENTREPRISE_PRIVEE",
  "INSTITUTION_FINANCIERE",
  "ORGANISATION_INTERNATIONALE",
  "ONG_ASSOCIATION",
  "UNIVERSITE",
  "ORGANISATION_PROFESSIONNELLE",
  "AUTRE",
] as const;

export const SECTORS = [
  "ADMINISTRATION_PUBLIQUE",
  "AGRICULTURE",
  "BANQUE_FINANCE_ASSURANCE",
  "COMMERCE",
  "EDUCATION",
  "ENERGIE",
  "ENVIRONNEMENT",
  "JUSTICE",
  "MINES",
  "SANTE",
  "SECURITE",
  "TELECOMMUNICATIONS",
  "TRANSPORT_LOGISTIQUE",
  "EAU_ASSAINISSEMENT",
  "INDUSTRIE",
  "SERVICES",
  "AUTRE",
] as const;

export const PROBLEM_DOMAINS = [
  "GESTION_DONNEES",
  "ACCES_INFORMATION",
  "GESTION_DOCUMENTAIRE",
  "ARCHIVAGE",
  "COMMUNICATION_INTERNE",
  "COMMUNICATION_USAGERS",
  "RH",
  "FINANCES",
  "BENEFICIAIRES",
  "SUIVI_ACTIVITES",
  "COLLECTE_TERRAIN",
  "PAIEMENTS",
  "STOCKS",
  "LOGISTIQUE",
  "SECURITE",
  "CYBERSECURITE",
  "PRISE_DECISION",
  "STATISTIQUES",
  "COORDINATION",
  "INTERCONNEXION",
  "AUTOMATISATION",
  "AUTRE",
] as const;

export const SOLUTION_TYPES = [
  "APPLICATION_MOBILE",
  "PLATEFORME_WEB",
  "DIGITALISATION_PROCESSUS",
  "GED",
  "SIRH",
  "PAIEMENT",
  "BASE_DE_DONNEES",
  "TABLEAU_DE_BORD",
  "IA",
  "CHATBOT",
  "ANALYSE_DONNEES",
  "GEOLOCALISATION",
  "CYBERSECURITE",
  "IDENTITE_NUMERIQUE",
  "SIGNATURE_ELECTRONIQUE",
  "INTEROPERABILITE",
  "CLOUD",
  "IOT",
  "BLOCKCHAIN",
  "FORMATION",
  "AUTRE",
] as const;

export const PRIORITY_LEVELS = ["FAIBLE", "MOYEN", "ELEVE", "TRES_ELEVE"] as const;
export const TIMELINES = ["MOINS_3_MOIS", "3_6_MOIS", "6_12_MOIS", "1_2_ANS", "A_DETERMINER"] as const;
export const YES_MAYBE_NO = ["OUI", "PEUT_ETRE", "NON"] as const;
export const BUDGET_BANDS = [
  "MOINS_5000",
  "5000_20000",
  "20000_50000",
  "50000_100000",
  "PLUS_100000",
  "CONFIDENTIEL",
] as const;
export const FIKIRI_CHALLENGE = ["OUI", "NON", "A_DISCUTER"] as const;
export const DIGITIZATION_LEVELS = [
  "PAPIER",
  "PARTIEL",
  "NUMERIQUE",
  "AVANCE",
] as const;
export const PROJECT_STAGES = [
  "IDEE",
  "PROTOTYPE",
  "PILOTE",
  "EN_PRODUCTION",
  "A_ADAPTER",
] as const;

export const PROJECT_CAPABILITIES = [
  ...new Set([...SOLUTION_TYPES, ...PROBLEM_DOMAINS]),
] as const;

export const MATCH_SCORE_NOTIFY_AT = 60;
export const MATCH_BATCH_SIZE = 40;

export function isPublishableConsent(consent: string) {
  return consent === "NAMED" || consent === "ANONYMOUS";
}
