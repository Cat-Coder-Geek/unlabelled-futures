// Dashboard datasets. Every figure carries its source. Figures marked
// `status: "reference"` are the published reference values supplied for this
// project and are flagged in the UI as pending verification against the
// original publication. Nothing here is generated or estimated.

export type Source = {
  dataset: string;
  authority: string;
  year: string;
  url: string;
  coverage: string;
};

export type Split = { label: string; female: number | null; male: number | null; status: "reference" | "unavailable"; source: Source };

export const KHDA_LANDSCAPE: Source = {
  dataset: "Dubai Private Education Landscape 2024–25",
  authority: "Knowledge and Human Development Authority (KHDA)",
  year: "2024–25 academic year",
  url: "https://www.khda.gov.ae/en/publications",
  coverage: "Emirate of Dubai — private schools",
};

export const KHDA_HE: Source = {
  dataset: "Higher Education Statistics",
  authority: "Knowledge and Human Development Authority (KHDA)",
  year: "Latest published academic year",
  url: "https://www.khda.gov.ae/en/publications",
  coverage: "Emirate of Dubai — KHDA-licensed higher-education institutions",
};

export const DUBAI_PULSE: Source = {
  dataset: "KHDA open datasets",
  authority: "Dubai Pulse (Digital Dubai)",
  year: "Various",
  url: "https://www.dubaipulse.gov.ae/organisation/khda",
  coverage: "Emirate of Dubai",
};

export const UIS: Source = {
  dataset: "UIS Data Browser — SDG 4 indicators",
  authority: "UNESCO Institute for Statistics",
  year: "Latest available",
  url: "https://databrowser.uis.unesco.org/",
  coverage: "United Arab Emirates (national)",
};

export const UN_SDG: Source = {
  dataset: "Global SDG Indicators Database",
  authority: "United Nations Statistics Division",
  year: "Latest available",
  url: "https://unstats.un.org/sdgs/dataportal",
  coverage: "United Arab Emirates (national)",
};

export const SPLITS: Split[] = [
  { label: "Private-school students", female: 49, male: 51, status: "reference", source: KHDA_LANDSCAPE },
  { label: "Private-school teachers", female: 78, male: 22, status: "reference", source: KHDA_LANDSCAPE },
  { label: "Higher-education students", female: 44, male: 56, status: "reference", source: KHDA_HE },
  { label: "STEM programme enrolment", female: null, male: null, status: "unavailable", source: KHDA_HE },
];

// No verified multi-year gender series has been loaded yet, so the
// historical view renders an explicit "Data unavailable" state.
export const HISTORICAL: { year: string; female: number; male: number }[] = [];

export const SDG_TARGETS = [
  { code: "4.1", text: "All girls and boys complete free, equitable and quality primary and secondary education." },
  { code: "4.3", text: "Equal access for all women and men to affordable and quality technical, vocational and tertiary education." },
  { code: "4.5", text: "Eliminate gender disparities in education." },
  { code: "5.1", text: "End all forms of discrimination against all women and girls everywhere." },
  { code: "5.5", text: "Ensure women's full participation and equal opportunities for leadership." },
  { code: "5.b", text: "Enhance the use of enabling technology, in particular ICT, to promote the empowerment of women." },
];

// Schematic coverage zones for the map. These are real, publicly known
// education districts — NOT individual school locations or statistics.
export const COVERAGE_ZONES = [
  { id: "emirate", name: "Emirate of Dubai", x: 0, y: 0, kind: "area" as const, note: "KHDA regulates private schools across the whole emirate. The private-school student and teacher splits describe this full coverage area.", source: KHDA_LANDSCAPE },
  { id: "diac", name: "Dubai International Academic City", x: 63, y: 62, kind: "point" as const, note: "A free-zone campus district hosting multiple KHDA-licensed higher-education institutions. Included in the higher-education coverage.", source: KHDA_HE },
  { id: "dkp", name: "Dubai Knowledge Park", x: 38, y: 48, kind: "point" as const, note: "Free-zone hub for higher education and training providers. Included in the higher-education coverage.", source: KHDA_HE },
  { id: "dso", name: "Dubai Silicon Oasis", x: 68, y: 54, kind: "point" as const, note: "Technology park with higher-education campuses. Included in the higher-education coverage.", source: KHDA_HE },
];
