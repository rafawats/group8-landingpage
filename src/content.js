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
  swing: { title: "PlanAssist", text: "A GenAI planning tool built on weak data, tested in one “successful” region and then rolled out globally." },
  strict: { title: "Too strict", when: "After PlanAssist", text: "Strict central controls were imposed. Delivery slowed and regions worked around them." },
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
  planassist: "Uses governed data products only",
};

export const recommendations = [
  { title: "Centralise Product Master and Promotion & Trade", text: "One shared version across all regions: mandatory pack size, one shelf-life definition, standard promotion mechanics and complete funding fields." },
  { title: "Build Sales History from regional data", text: "Regions keep producing their own sales data, but follow common templates (SKU, customer, week) and a global customer ID." },
  { title: "Govern through two tiers", text: "A Corporate Data Council sets standards for the three data products and minimum standards for everything else; Regional Councils own the rest." },
  { title: "One central data catalog", text: "Every data product, asset and dataset, with its owner, definitions, quality status and how it can be used." },
  { title: "PlanAssist on governed data only", text: "PlanAssist consumes only governed data products, with human review of promotion decisions until the data is trusted." },
];

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

// Replace "[Role in the project]" with each person's role, or delete a photo file to show initials instead.
export const team = [
  { name: "Rafael Watson Gonzalez", role: "[Role in the project]", photo: "team/rafael.jpg" },
  { name: "Rhea Sachdeva", role: "[Role in the project]", photo: "team/rhea.jpg" },
  { name: "Wenjie Yi", role: "[Role in the project]", photo: "team/wenjie.jpg" },
  { name: "Ignacio Gorris Corrales", role: "[Role in the project]", photo: "team/ignacio.jpg" },
];

// Put the files in public/downloads/ (or paste full links) and they become live buttons.
// Leave href empty to hide a button.
export const resources = [
  { label: "Executive report", note: "PDF", href: "" },
  { label: "Presentation slides", note: "PDF", href: "" },
  { label: "Project repository", note: "GitHub", href: "" },
];
