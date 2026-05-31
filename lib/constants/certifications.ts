/**
 * Ski-instructeur certificeringen, gegroepeerd per opleidingsinstituut.
 * Op het profiel opgeslagen als gestructureerde data met:
 * name, level, year_obtained, certificate_url (upload), expiry_date (waar van toepassing).
 */

export type CertBodyKey =
  | "NEVSKI"
  | "BASI"
  | "OSV"
  | "DSV"
  | "SWISS"
  | "FSBA"
  | "INTL";

export interface CertBody {
  key: CertBodyKey;
  name: string;
  country: string;
  flag: string;
  note?: string;
}

export interface Certification {
  id: string;
  body: CertBodyKey;
  name: string;
  /** Tooltip-uitleg voor skischolen die de verschillen niet kennen. */
  tooltip: string;
  /** ÖSV Anwärter = minimumniveau platform. */
  isMinimumLevel?: boolean;
  /** ISIA stamp krijgt een speciale "Internationaal erkend"-badge. */
  isiaHighlight?: boolean;
}

export const CERT_BODIES: CertBody[] = [
  { key: "NEVSKI", name: "NEVSKI", country: "Nederland", flag: "🇳🇱", note: "Primaire doelgroep" },
  { key: "BASI", name: "BASI", country: "Verenigd Koninkrijk", flag: "🇬🇧" },
  { key: "OSV", name: "ÖSV", country: "Oostenrijk", flag: "🇦🇹", note: "Staatsdiploma" },
  { key: "DSV", name: "DSV", country: "Duitsland", flag: "🇩🇪" },
  { key: "SWISS", name: "Swiss Snowsports", country: "Zwitserland", flag: "🇨🇭" },
  { key: "FSBA", name: "FSBA / BVSL", country: "België", flag: "🇧🇪" },
  { key: "INTL", name: "Internationaal", country: "Wereldwijd", flag: "🌍" },
];

export const CERTIFICATIONS: Certification[] = [
  // 🇳🇱 NEVSKI
  { id: "nevski-1", body: "NEVSKI", name: "NEVSKI 1", tooltip: "Recreatief, basis groepslessen." },
  { id: "nevski-2", body: "NEVSKI", name: "NEVSKI 2", tooltip: "Gevorderd, zelfstandige lessen." },
  { id: "nevski-3", body: "NEVSKI", name: "NEVSKI 3", tooltip: "Professioneel niveau." },
  { id: "nevski-4", body: "NEVSKI", name: "NEVSKI 4", tooltip: "Hoogste Nederlandse niveau." },
  { id: "nevski-sb-1", body: "NEVSKI", name: "NEVSKI Snowboard 1", tooltip: "Snowboard basis." },
  { id: "nevski-sb-2", body: "NEVSKI", name: "NEVSKI Snowboard 2", tooltip: "Snowboard gevorderd." },
  { id: "nevski-sb-3", body: "NEVSKI", name: "NEVSKI Snowboard 3", tooltip: "Snowboard professioneel." },

  // 🇬🇧 BASI
  { id: "basi-1", body: "BASI", name: "BASI Level 1", tooltip: "Brits instapniveau, lessen op kunstpiste/beginnershellingen." },
  { id: "basi-2", body: "BASI", name: "BASI Level 2", tooltip: "Brits, zelfstandige lessen op de piste." },
  { id: "basi-3", body: "BASI", name: "BASI Level 3", tooltip: "Brits, gevorderd lesgeven." },
  { id: "basi-4", body: "BASI", name: "BASI Level 4 ISTD", tooltip: "Internationaal erkend, hoogste BASI-niveau." },
  { id: "basi-sb-1", body: "BASI", name: "BASI Snowboard Level 1", tooltip: "Snowboard instapniveau." },
  { id: "basi-sb-2", body: "BASI", name: "BASI Snowboard Level 2", tooltip: "Snowboard zelfstandig." },
  { id: "basi-sb-3", body: "BASI", name: "BASI Snowboard Level 3", tooltip: "Snowboard gevorderd." },
  { id: "basi-sb-4", body: "BASI", name: "BASI Snowboard Level 4", tooltip: "Snowboard hoogste niveau." },

  // 🇦🇹 ÖSV
  { id: "osv-wart", body: "OSV", name: "ÖSV Schilehrerwart", tooltip: "Oostenrijks basisniveau, ondersteunend lesgeven." },
  { id: "osv-anwaerter", body: "OSV", name: "ÖSV Schilehrer Anwärter", tooltip: "Minimumniveau om op het platform actief te zijn.", isMinimumLevel: true },
  { id: "osv-landes", body: "OSV", name: "ÖSV Landesschilehrer", tooltip: "Oostenrijks gevorderd, deelstaatniveau." },
  { id: "osv-staatlich", body: "OSV", name: "ÖSV Staatlich geprüfter Schilehrer", tooltip: "Oostenrijks staatsexamen, hoogste niveau." },

  // 🇩🇪 DSV
  { id: "dsv-c", body: "DSV", name: "DSV Trainer C", tooltip: "Duits instapniveau trainer." },
  { id: "dsv-b", body: "DSV", name: "DSV Trainer B", tooltip: "Duits gevorderd trainer." },
  { id: "dsv-a", body: "DSV", name: "DSV Trainer A", tooltip: "Duits hoogste trainersniveau." },
  { id: "dsv-lehrer", body: "DSV", name: "DSV Ski Lehrer", tooltip: "Duits skileraar." },

  // 🇨🇭 Swiss Snowsports
  { id: "swiss-js", body: "SWISS", name: "Swiss Snowsports J+S", tooltip: "Zwitsers jeugd+sport instapniveau." },
  { id: "swiss-leiter", body: "SWISS", name: "Swiss Snowsports Leiter", tooltip: "Zwitsers leider/instructeur." },
  { id: "swiss-experte", body: "SWISS", name: "Swiss Snowsports Experte", tooltip: "Zwitsers hoogste niveau." },

  // 🇧🇪 FSBA / BVSL
  { id: "fsba-brevet-b", body: "FSBA", name: "Moniteur de ski Brevet B", tooltip: "Belgisch instapniveau." },
  { id: "fsba-brevet-a", body: "FSBA", name: "Moniteur de ski Brevet A", tooltip: "Belgisch gevorderd." },
  { id: "fsba-federal", body: "FSBA", name: "Moniteur fédéral", tooltip: "Belgisch federaal niveau." },

  // 🌍 Internationaal
  { id: "isia-stamp", body: "INTL", name: "ISIA Stamp", tooltip: "Internationaal erkend — vereist voor werken buiten eigen land.", isiaHighlight: true },
  { id: "isb-sb-1", body: "INTL", name: "ISB Snowboard Level 1", tooltip: "Internationaal snowboard niveau 1." },
  { id: "isb-sb-2", body: "INTL", name: "ISB Snowboard Level 2", tooltip: "Internationaal snowboard niveau 2." },
  { id: "isb-sb-3", body: "INTL", name: "ISB Snowboard Level 3", tooltip: "Internationaal snowboard niveau 3." },
];

export const getCertById = (id: string) => CERTIFICATIONS.find((c) => c.id === id);

export const CERTIFICATIONS_BY_BODY: Record<CertBodyKey, Certification[]> = CERT_BODIES.reduce(
  (acc, b) => {
    acc[b.key] = CERTIFICATIONS.filter((c) => c.body === b.key);
    return acc;
  },
  {} as Record<CertBodyKey, Certification[]>,
);
