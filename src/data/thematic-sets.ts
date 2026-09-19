import type { VocabWord } from "@/types/vocabulary";
import { SAMPLE_VOCAB_WORDS } from "./sample-vocabulary";

/** A curated, thematic vocabulary set. The groupings follow the
 * topic families used by major academic word lists (the Harvard/Coxhead
 * Academic Word List) and Oxford's topic-based learner vocabulary, mapped
 * onto STEP's content strands (environment, health, economy, science,
 * education, technology, society, writing, grammar, everyday listening).
 * These are curated content (like courses and lessons), not per-user
 * documents — each references word IDs from the vocabulary bank and is
 * rendered alongside the user's own sets. */
export interface ThematicSet {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  /** lucide icon name representing the topic. */
  icon: string;
  wordIds: string[];
}

/** Word lookup built from the vocabulary bank. */
const WORDS_BY_ID = new Map(SAMPLE_VOCAB_WORDS.map((w) => [w.id, w]));

export function getWordById(id: string): VocabWord | undefined {
  return WORDS_BY_ID.get(id);
}

export const THEMATIC_SETS: ThematicSet[] = [
  {
    id: "set-environment",
    nameAr: "البيئة والطاقة",
    nameEn: "Environment & Energy",
    descriptionAr: "مفردات قطع المناخ والطاقة المتجددة والاستدامة.",
    descriptionEn: "Vocabulary from climate, renewable energy, and sustainability passages.",
    icon: "leaf",
    wordIds: [
      "vocab-agriculture", "vocab-arable", "vocab-biodiversity", "vocab-biodiversity-bio", "vocab-brine", "vocab-consume", "vocab-consumption", "vocab-conventional",
      "vocab-decompose", "vocab-dispose", "vocab-ecosystem", "vocab-emission", "vocab-environment", "vocab-environmental", "vocab-erode", "vocab-extraction",
      "vocab-finite", "vocab-habitat", "vocab-irrigation", "vocab-microplastic", "vocab-migrate", "vocab-mitigate", "vocab-pollution", "vocab-renewable",
      "vocab-scarcity", "vocab-species", "vocab-survive", "vocab-sustainability", "vocab-transit", "vocab-transport", "vocab-urbanization",
    ],
  },
  {
    id: "set-health",
    nameAr: "الصحة والطب",
    nameEn: "Health & Medicine",
    descriptionAr: "التغذية، التشخيص، الوقاية، والجوانب الصحية في القطع.",
    descriptionEn: "Nutrition, diagnosis, prevention, and health-related reading content.",
    icon: "heart-pulse",
    wordIds: [
      "vocab-chronic", "vocab-deficiency", "vocab-diagnosis", "vocab-immune", "vocab-induce", "vocab-injury", "vocab-medical", "vocab-mental",
      "vocab-nutrition", "vocab-physical", "vocab-practitioner", "vocab-prevention", "vocab-recover", "vocab-relax", "vocab-stress", "vocab-susceptible",
      "vocab-therapy", "vocab-trigger",
    ],
  },
  {
    id: "set-business",
    nameAr: "الأعمال والاقتصاد",
    nameEn: "Business & Economy",
    descriptionAr: "الشركات، السوق، المال، والوظائف في النصوص الاقتصادية.",
    descriptionEn: "Companies, markets, money, and careers in economic texts.",
    icon: "briefcase",
    wordIds: [
      "vocab-administration", "vocab-allocate", "vocab-applicant", "vocab-commission", "vocab-commodity", "vocab-compensate", "vocab-corporate", "vocab-credit",
      "vocab-distribute", "vocab-economic", "vocab-entrepreneur", "vocab-estate", "vocab-export", "vocab-fluctuate", "vocab-implement", "vocab-incentive",
      "vocab-innovate", "vocab-labor", "vocab-margin", "vocab-output", "vocab-professional", "vocab-promote", "vocab-prospect", "vocab-purchase",
      "vocab-revenue", "vocab-scheme", "vocab-sector", "vocab-shift", "vocab-subsidy",
    ],
  },
  {
    id: "set-education",
    nameAr: "التعليم والدراسة",
    nameEn: "Education & Study",
    descriptionAr: "منهجيات التعلم والمصطلحات الأكاديمية والجامعية.",
    descriptionEn: "Learning, study methods, and academic/university terms.",
    icon: "graduation-cap",
    wordIds: [
      "vocab-academic", "vocab-access", "vocab-achieve", "vocab-advisor", "vocab-approach", "vocab-assess", "vocab-assign", "vocab-assist",
      "vocab-attain", "vocab-capable", "vocab-chapter", "vocab-colleague", "vocab-comprehension", "vocab-curriculum", "vocab-enable", "vocab-fluency",
      "vocab-institute", "vocab-instruct", "vocab-intermediate", "vocab-journal", "vocab-lecture", "vocab-literacy", "vocab-method", "vocab-orient",
      "vocab-participate", "vocab-primary", "vocab-register", "vocab-simultaneous", "vocab-vocabulary",
    ],
  },
  {
    id: "set-science",
    nameAr: "العلوم والبحث",
    nameEn: "Science & Research",
    descriptionAr: "المنهج العلمي، النظريات، والتجارب البحثية.",
    descriptionEn: "The scientific method, theories, and research experiments.",
    icon: "flask-conical",
    wordIds: [
      "vocab-analyze", "vocab-assume", "vocab-attribute", "vocab-average", "vocab-bond", "vocab-chemical", "vocab-collapse", "vocab-demonstrate",
      "vocab-derive", "vocab-detect", "vocab-dimension", "vocab-empirical", "vocab-equation", "vocab-formula", "vocab-hypothesis", "vocab-inference",
      "vocab-investigate", "vocab-isolate", "vocab-layer", "vocab-mechanism", "vocab-nuclear", "vocab-parameter", "vocab-percent", "vocab-phase",
      "vocab-phenomenon", "vocab-proportion", "vocab-radical", "vocab-random", "vocab-ratio", "vocab-react", "vocab-research", "vocab-statistic",
      "vocab-survey", "vocab-symbol", "vocab-theory",
    ],
  },
  {
    id: "set-technology",
    nameAr: "التقنية والابتكار",
    nameEn: "Technology & Innovation",
    descriptionAr: "الأجهزة، البرمجيات، والاتصالات الرقمية.",
    descriptionEn: "Devices, software, and digital communications.",
    icon: "cpu",
    wordIds: [
      "vocab-automate", "vocab-code", "vocab-component", "vocab-compute", "vocab-design", "vocab-device", "vocab-domain", "vocab-electrify",
      "vocab-generate", "vocab-infrastructure", "vocab-insert", "vocab-manual", "vocab-mature", "vocab-mode", "vocab-monitor", "vocab-network",
      "vocab-simulate", "vocab-technical", "vocab-technology", "vocab-transmit", "vocab-version", "vocab-virtual", "vocab-visual",
    ],
  },
  {
    id: "set-society",
    nameAr: "المجتمع والقانون",
    nameEn: "Society & Law",
    descriptionAr: "الحكومة، الأنظمة، والقضايا الاجتماعية.",
    descriptionEn: "Government, regulations, and social issues.",
    icon: "landmark",
    wordIds: [
      "vocab-advocate", "vocab-amend", "vocab-authority", "vocab-civil", "vocab-commit", "vocab-community", "vocab-consent", "vocab-culture",
      "vocab-deny", "vocab-discriminate", "vocab-domestic", "vocab-ethnic", "vocab-gender", "vocab-generation", "vocab-hierarchy", "vocab-ideology",
      "vocab-impose", "vocab-intervene", "vocab-legal", "vocab-legislate", "vocab-liberal", "vocab-license", "vocab-media", "vocab-mediate",
      "vocab-military", "vocab-ministry", "vocab-minority", "vocab-municipal", "vocab-occupy", "vocab-policy", "vocab-pose", "vocab-prohibit",
      "vocab-reform", "vocab-regulate", "vocab-reside", "vocab-restrain", "vocab-restrict", "vocab-sole", "vocab-tradition", "vocab-unify",
      "vocab-violate", "vocab-voluntary", "vocab-welfare",
    ],
  },
  {
    id: "set-writing",
    nameAr: "الكتابة والتحليل",
    nameEn: "Writing & Analysis",
    descriptionAr: "مصطلحات الكتابة الأكاديمية والتحليل النصي (قسم Writing Analysis).",
    descriptionEn: "Academic writing and text-analysis terms (the Writing Analysis strand).",
    icon: "pen-line",
    wordIds: [
      "vocab-abstract", "vocab-accurate", "vocab-append", "vocab-appropriate", "vocab-as-a-consequence", "vocab-aspect", "vocab-bring-about", "vocab-chart",
      "vocab-cite", "vocab-clarify", "vocab-coherent", "vocab-comparison", "vocab-concise", "vocab-conclude", "vocab-construct", "vocab-document",
      "vocab-draft", "vocab-draw-a-conclusion", "vocab-element", "vocab-emphasis", "vocab-evidence", "vocab-exhibit", "vocab-feature", "vocab-focus",
      "vocab-give-rise-to", "vocab-highlight", "vocab-illustrate", "vocab-in-contrast-to", "vocab-in-light-of", "vocab-in-terms-of", "vocab-justify", "vocab-logic",
      "vocab-neutral", "vocab-omit", "vocab-on-the-contrary", "vocab-outline", "vocab-paragraph", "vocab-pave-the-way-for", "vocab-perspective", "vocab-play-a-crucial-role",
      "vocab-proofread", "vocab-range", "vocab-retain", "vocab-revise", "vocab-shed-light-on", "vocab-source", "vocab-specific", "vocab-specify",
      "vocab-stem-from", "vocab-structure", "vocab-style", "vocab-summary", "vocab-take-into-account", "vocab-thesis", "vocab-verify", "vocab-with-respect-to",
    ],
  },
  {
    id: "set-grammar",
    nameAr: "بنية الجملة",
    nameEn: "Grammar & Structure",
    descriptionAr: "مصطلحات الأزمنة، الجمل، وحروف العطف.",
    descriptionEn: "Tense, clause, and conjunction terminology.",
    icon: "type",
    wordIds: [
      "vocab-active", "vocab-albeit", "vocab-antecedent", "vocab-auxiliary", "vocab-causative", "vocab-clause", "vocab-comma-splice", "vocab-conjunction",
      "vocab-correlative", "vocab-deduction", "vocab-denote", "vocab-distinct", "vocab-double-negative", "vocab-equivalent", "vocab-formal", "vocab-gerund",
      "vocab-hypothetical", "vocab-infinitive", "vocab-informal", "vocab-inversion", "vocab-likewise", "vocab-modifier", "vocab-nevertheless", "vocab-nonetheless",
      "vocab-notwithstanding", "vocab-noun-clause", "vocab-parallel", "vocab-participle", "vocab-passive", "vocab-phrasal-verb", "vocab-plural", "vocab-possessive",
      "vocab-singular", "vocab-subordinate", "vocab-superlative", "vocab-tense", "vocab-thereby", "vocab-whereby",
    ],
  },
  {
    id: "set-everyday",
    nameAr: "الحوارات والخدمات",
    nameEn: "Conversations & Services",
    descriptionAr: "مفردات مواقف الاستماع اليومية: الحجز، الشكاوى، والسفر.",
    descriptionEn: "Day-to-day listening situations: bookings, complaints, and travel.",
    icon: "messages-square",
    wordIds: [
      "vocab-accommodate", "vocab-adjacent", "vocab-apologize", "vocab-appointment", "vocab-assemble", "vocab-assure", "vocab-attach", "vocab-available",
      "vocab-boarding-pass", "vocab-channel", "vocab-commence", "vocab-complaint", "vocab-confirm", "vocab-connecting-flight", "vocab-crucial", "vocab-deadline",
      "vocab-delivery", "vocab-inconvenience", "vocab-inquire", "vocab-locate", "vocab-membership", "vocab-mention", "vocab-mix-up", "vocab-postpone",
      "vocab-precaution", "vocab-precise", "vocab-prefer", "vocab-refund", "vocab-refund-exchange", "vocab-reservation", "vocab-roughly", "vocab-schedule",
      "vocab-store-credit", "vocab-suggest", "vocab-unfortunately", "vocab-urgent",
    ],
  },
  {
    id: "set-academic-core",
    nameAr: "الأكاديمية الأساسية",
    nameEn: "Core Academic",
    descriptionAr: "المفردات الأكاديمية عالية التكرار (نواة قوائم Academic Word List).",
    descriptionEn: "High-frequency academic vocabulary — the AWL core.",
    icon: "book-marked",
    wordIds: [
      "vocab-abandon", "vocab-accompany", "vocab-accumulate", "vocab-acknowledge", "vocab-acquire", "vocab-adapt", "vocab-adequate", "vocab-adjust",
      "vocab-affect", "vocab-aggregate", "vocab-alter", "vocab-alternative", "vocab-ambiguous", "vocab-analogy", "vocab-annual", "vocab-anticipate",
      "vocab-antonym", "vocab-apparent", "vocab-appreciate", "vocab-approximate", "vocab-approximately", "vocab-arbitrary", "vocab-attitude", "vocab-author",
      "vocab-automatic", "vocab-aware", "vocab-behalf", "vocab-benchmark", "vocab-beneficial", "vocab-bias", "vocab-brief", "vocab-bulk",
      "vocab-capacity", "vocab-carry-out", "vocab-category", "vocab-cease", "vocab-circumstance", "vocab-classic", "vocab-cognitive", "vocab-coincide",
      "vocab-comment", "vocab-compatible", "vocab-compile", "vocab-complex", "vocab-compound", "vocab-comprehensive", "vocab-concept", "vocab-conduct",
      "vocab-consequence", "vocab-considerable", "vocab-consist", "vocab-consolidate", "vocab-constant", "vocab-constrain", "vocab-context", "vocab-contribute",
      "vocab-convene", "vocab-coordinate", "vocab-core", "vocab-cue", "vocab-deduce", "vocab-deliberate", "vocab-depict", "vocab-determine",
      "vocab-deviate", "vocab-diminish", "vocab-disadvantage", "vocab-displacement", "vocab-display", "vocab-disproportionately", "vocab-distort", "vocab-diverse",
      "vocab-dominate", "vocab-dramatic", "vocab-duration", "vocab-dynamic", "vocab-efficient", "vocab-encounter", "vocab-enhance", "vocab-enormous",
      "vocab-ensure", "vocab-entity", "vocab-equate", "vocab-equip", "vocab-error", "vocab-essential", "vocab-establish", "vocab-estimate",
      "vocab-evaluate", "vocab-eventual", "vocab-evident", "vocab-evolve", "vocab-exceed", "vocab-exclude", "vocab-expand", "vocab-explicit",
      "vocab-exploit", "vocab-expose", "vocab-external", "vocab-extract", "vocab-facilitate", "vocab-factor", "vocab-feasible", "vocab-final",
      "vocab-flexibility", "vocab-flexible", "vocab-foundation", "vocab-framework", "vocab-fundamental", "vocab-globe", "vocab-identical", "vocab-impact",
      "vocab-implicit", "vocab-imply", "vocab-inadequate", "vocab-incorporate", "vocab-index", "vocab-indicate", "vocab-inevitable", "vocab-infer",
      "vocab-inherent", "vocab-inhibit", "vocab-initial", "vocab-initiate", "vocab-insight", "vocab-inspect", "vocab-instance", "vocab-integral",
      "vocab-integrate", "vocab-integrity", "vocab-intense", "vocab-interact", "vocab-internal", "vocab-interpret", "vocab-interval", "vocab-intrinsic",
      "vocab-invoke", "vocab-involve", "vocab-isolated", "vocab-issue", "vocab-item", "vocab-label", "vocab-link", "vocab-maintain",
      "vocab-major", "vocab-manipulate", "vocab-maximize", "vocab-maximum", "vocab-medium", "vocab-minimal", "vocab-minimize", "vocab-minimum",
      "vocab-modify", "vocab-momentum", "vocab-motive", "vocab-mutual", "vocab-negate", "vocab-normal", "vocab-notion", "vocab-objective",
      "vocab-obstacle", "vocab-obtain", "vocab-obvious", "vocab-occur", "vocab-option", "vocab-outcome", "vocab-outweigh", "vocab-overall",
      "vocab-overlap", "vocab-oversee", "vocab-partner", "vocab-perceive", "vocab-period", "vocab-persist", "vocab-persistent", "vocab-plus",
      "vocab-portion", "vocab-positive", "vocab-potential", "vocab-precede", "vocab-predict", "vocab-predominant", "vocab-preliminary", "vocab-presume",
      "vocab-prevalent", "vocab-previous", "vocab-prime", "vocab-principal", "vocab-principle", "vocab-prior", "vocab-priority", "vocab-proceed",
      "vocab-process", "vocab-project", "vocab-protocol", "vocab-provide", "vocab-publication", "vocab-publish", "vocab-pursue", "vocab-quote",
      "vocab-rational", "vocab-rationale", "vocab-redundant", "vocab-refine", "vocab-region", "vocab-reinforce", "vocab-reject", "vocab-release",
      "vocab-relevant", "vocab-reliable", "vocab-reluctant", "vocab-rely", "vocab-remove", "vocab-replace", "vocab-require", "vocab-resemble",
      "vocab-resolve", "vocab-resource", "vocab-respond", "vocab-restore", "vocab-reveal", "vocab-reverse", "vocab-rigid", "vocab-rigorous",
      "vocab-role", "vocab-route", "vocab-scenario", "vocab-scope", "vocab-secondary", "vocab-section", "vocab-secure", "vocab-seek",
      "vocab-select", "vocab-sequence", "vocab-series", "vocab-significant", "vocab-similar", "vocab-site", "vocab-so-called", "vocab-somewhat",
      "vocab-sphere", "vocab-stable", "vocab-status", "vocab-straightforward", "vocab-strategy", "vocab-submit", "vocab-subsequent", "vocab-substitute",
      "vocab-subtle", "vocab-successive", "vocab-sufficient", "vocab-supplement", "vocab-suspend", "vocab-sustain", "vocab-sustained", "vocab-synonym",
      "vocab-tangible", "vocab-target", "vocab-task", "vocab-team", "vocab-technique", "vocab-temporary", "vocab-term", "vocab-text",
      "vocab-theme", "vocab-topic", "vocab-trace", "vocab-transfer", "vocab-transform", "vocab-trend", "vocab-ultimate", "vocab-undergo",
      "vocab-underlie", "vocab-undermine", "vocab-undertake", "vocab-uniform", "vocab-unique", "vocab-utilize", "vocab-valid", "vocab-vary",
      "vocab-vehicle", "vocab-via", "vocab-visible", "vocab-vision", "vocab-vital", "vocab-volume", "vocab-widespread", "vocab-yield",
    ],
  },
];

export const allThematicWordIds = new Set(THEMATIC_SETS.flatMap((s) => s.wordIds));
