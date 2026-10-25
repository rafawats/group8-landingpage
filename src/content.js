// All the words on the page live here, so the team can edit them without touching the layout.

export const project = {
  course: "MIS41520 Strategic Data Management",
  school: "UCD Michael Smurfit Graduate Business School",
  title: "Balancing innovation and control",
  subtitle: "A Hybrid Data Mesh for Auramax Foods Group",
  lead: "Central rules where data is shared, regional freedom where it isn’t. Group 8’s data governance proposal for an acquisition-led, federated food company.",
};

export const diagnosis = {
  claim: "AFG has not adopted a data governance strategy that fits its business model and balances innovation with control.",
  loose: { title: "Too loose", when: "2022–2026", text: "Each region set its own initiatives and data quality priorities, and every acquisition added more variation: silos and fragmented data." },
  swing: { title: "PlanAssist", text: "A GenAI planning tool built on weak data, tested in one “successful” region and then rolled out globally.",
    effect: "It overestimated demand in three countries, causing overproduction and waste." },
  strict: { title: "Too strict", when: "After PlanAssist", text: "Strict central controls were imposed. Delivery slowed and regions worked around them." },
  missing: { when: "What was missing", title: "The middle ground", text: "Neither extreme fits a federated company. AFG needs central rules where data is shared, and regional freedom where it isn’t." },
  balance: { title: "Hybrid Data Mesh", text: "The balance point we propose" },
  takeaway: "Without a governance model that fits its federated structure, any digital initiative at AFG will inherit the same inconsistencies.",
};

export const mesh = {
  intro: "Central control depends on how widely data is shared across regions.",
  councils: [
    { name: "Corporate Data Council", text: "Global standards and contracts" },
    { name: "Regional Councils", text: "Local priorities" },
  ],
  products: [
    { name: "Product Master", text: "pack size, shelf life" },
    { name: "Promotion & Trade", text: "standard mechanics" },
    { name: "Sales History", text: "built from regional data" },
  ],
  assets: [
    { name: "Supply Planning", text: "regional operations" },
    { name: "Analytics Platform", text: "regional reporting" },
    { name: "Sales & Invoicing", text: "shared template", feeds: true },
    { name: "Customer & Locations", text: "global customer ID", feeds: true },
  ],
  catalog: "Every data product and asset, and who owns it",
  owners: { product: "Central", asset: "Regional" },
  planassist: "Uses governed data products only",
  future: {
    name: "Future initiatives",
    options: [
      { name: "Data products", text: "when the data is shared across regions" },
      { name: "Local innovation", text: "kept under the Regional Councils’ priorities" },
    ],
  },
  // The diagram builds in these steps; each caption shows while its step plays.
  steps: [
    { label: "Councils", text: "Two tiers of decision rights: a Corporate Data Council for global standards and contracts, and Regional Councils for local priorities." },
    { label: "Data products", text: "Three data products are owned and certified centrally, because every region depends on them." },
    { label: "Regional assets", text: "Everything else stays with the regions. Sales & Invoicing and Customer & Locations follow a shared template and a global customer ID, so they feed Sales History." },
    { label: "Data catalog", text: "Every data product and asset is listed in one data catalog, with who owns it." },
    { label: "Consumers", text: "PlanAssist uses governed data products only. Future initiatives either build on data products or stay as innovations under local priorities." },
  ],
};

export const recommendations = [
  { title: "Centralise Product Master and Promotion & Trade", text: "One shared version across all regions: mandatory pack size, one shelf-life definition, standard promotion mechanics and complete funding fields." },
  { title: "Build Sales History from regional data", text: "Regions keep producing their own sales data, but follow common templates (SKU, customer, week) and a global customer ID." },
  { title: "Govern through two tiers", text: "A Corporate Data Council sets standards for the three data products and minimum standards for everything else; Regional Councils own the rest." },
  { title: "One central data catalog", text: "Every data product, asset and dataset, with its owner, definitions, quality status and how it can be used." },
  { title: "PlanAssist on governed data only", text: "PlanAssist consumes only governed data products, with human review of promotion decisions until the data is trusted." },
];

// Shown above all five moves once the card stack has been scrolled through.
export const recommendationsFinale = "Five moves, one Hybrid Data Mesh";

export const roadmap = [
  { phase: "Stabilise", when: "Days 0–30", color: "ember",
    text: "Pause PlanAssist. Assess the existing councils and catalog tool, and measure today’s baselines for data completeness and promotion ROI.",
    done: "Gap report and baselines approved." },
  { phase: "Foundations", when: "Days 30–90", color: "signal",
    text: "Set up the Corporate and Regional Councils, replace blanket central controls with minimum standards, train data owners, design the three data products and build catalog v1.",
    done: "New decision rights in force; owners named and canvases approved." },
  { phase: "Build", when: "Months 3–12", color: "slate",
    text: "Build Product Master and Promotion & Trade, then Sales History with shared templates and a global customer ID. Publish data contracts and roll out the catalog.",
    done: "≥95% complete product data, all regions on the template, contracts in the catalog." },
  { phase: "Scale", when: "Months 12–18", color: "navy",
    text: "Restart PlanAssist on certified data in two or more regions, then region by region. Extend the catalog to all regional data and new acquisitions.",
    done: "Promotion ROI up vs. baseline; ≥90% of data assets catalogued." },
];

// Add a role to show it under a name (leave it empty to hide it), or delete a photo file to show initials instead.
export const team = [
  { name: "Rafael Watson Gonzalez", role: "", photo: "team/rafael.jpg", linkedin: "https://www.linkedin.com/in/rafael-watson/" },
  { name: "Rhea Sachdeva", role: "", photo: "team/rhea.jpg", linkedin: "https://www.linkedin.com/in/rhea-sachdeva-6a76b5215/" },
  { name: "Wenjie Yi", role: "", photo: "team/wenjie.jpg", linkedin: "https://www.linkedin.com/in/wenjieyi/" },
  { name: "Ignacio Gorris Corrales", role: "", photo: "team/ignacio.jpg", linkedin: "https://www.linkedin.com/in/ignacio-gorris-corrales/" },
];
// The team title, drawn as "From 8 to ∞" (label is what screen readers hear).
export const teamTitle = { label: "From 8 to infinity", from: "From", to: "to" };
// The hint under the team title, for mouse and for touch screens.
export const teamHint = { hover: "Hover over one of us to say hi on LinkedIn", touch: "Tap one of us to say hi on LinkedIn" };

// Put the files in public/downloads/ (or paste full links) and they become live buttons.
// Leave href empty to hide a button.
export const resources = [
  { label: "Executive report", note: "PDF", href: "" },
  { label: "Presentation slides", note: "PDF", href: "" },
  { label: "Project repository", note: "GitHub", href: "" },
];

// The animated 8 in the hero: the small ring is innovation, the big ring is control, together they make the mark.
export const balance = {
  innovation: { name: "Innovation", text: "Regional freedom to set local priorities.", alone: "On its own: silos and fragmented data." },
  control: { name: "Control", text: "Central standards and data contracts.", alone: "On its own: slow delivery and workarounds." },
  solution: { kicker: "Innovation + control", name: "Hybrid Data Mesh", text: "Central control where data is shared, regional freedom where it isn’t." },
};
