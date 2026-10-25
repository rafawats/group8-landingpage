# Group 8 — Brand & Content Brief for the landing page

Put this folder (`brand-kit/`) in the repo root, then paste the prompt below into Claude Code.

> **Prompt for Claude Code**
>
> Read `brand-kit/BRAND.md` and `brand-kit/tokens.css`, and look at every image in `brand-kit/reference/` (they are the final presentation slides). Build a one-page landing site for Group 8's Auramax proposal (React + Vite, deployable to GitHub Pages at `rafawats.github.io/group8-landingpage/`, so use `base: "./"`). Follow the brand rules exactly: colours and fonts from `tokens.css`, logos from `brand-kit/assets/logo/` (use the SVGs; don't redraw them), team photos from `brand-kit/assets/team/`. Use the section order and copy in "Page content" below. Keep all copy in one `src/content.js` file so the team can edit it. It must work on phones, meet WCAG AA contrast, and respect `prefers-reduced-motion`. Don't invent figures, names or quotes. Leave `[placeholders]` as they are.

---

## 1. Who we are

- **Group 8** is a student "data strategy consultancy" (MIS41520 Strategic Data Management, UCD Michael Smurfit Graduate Business School).
- The client is **Auramax Foods Group (AFG)**, a fictional European FMCG company from the course case.
- **Tagline / idea:** *"From 8 to ∞"*. The infinity sign is the Group 8 mark turned on its side.
- **Voice:** a clear, confident consultancy. Plain English, short sentences, concrete numbers, no jargon without explanation. Use sentence case for titles. Use UPPERCASE only for small kickers and labels.

## 2. Logo

**The Group 8 mark** is two stacked rings: a small orange ring on top and a larger navy ring below.

- The geometry is exact; never redraw it freehand.
- It's an 80 × 116 box: `circle(40,28) r22` in Signal and `circle(40,80) r30` in Navy, stroke 12, no fill.
- On dark backgrounds, the big ring turns Mist `#ECEEF6`; the small ring stays Signal.

| File | Use |
|---|---|
| `group8-mark.svg` / `group8-mark-on-dark.svg` | favicon, nav, footer, small sizes |
| `group8-logo.png` / `-on-dark.png` | mark + "Group 8" wordmark (Space Grotesk 700, letter-spacing −0.04em) |
| `lockup-group8-x-auramax.png` / `-on-dark.png` | partnership lockup: "Group 8 × AURAMAX FOODS GROUP" (hero / cover) |
| `group8-infinity.svg` | the 8 on its side = ∞ (used in "From 8 to ∞") |
| `group8-rocket.svg` / `-on-dark.svg` | the 8 as a rocket: nose cone, fins and flame added (closing / call to action) |
| `group8-mark-faint.svg` | huge decorative 8 in `#E5E2DB`, bleeding off the right edge of light hero sections |
| `auramax-mark.svg` / `-on-dark.svg` | client icon (ring + leaf); also used as the "planet" the rocket flies to |
| `assets/qr/group8-qr.svg` | QR code to the site, with the 8 in the centre (keep it on a white card, 14px padding, radius 18px) |

**Rules**
- Keep clear space of at least the small ring's diameter around the mark.
- Minimum height is 20px.
- Never recolour, stretch, rotate (except the infinity and the rocket), outline or add effects.
- "AURAMAX" is set in Sora 800, with "AURA" in green `#1E4D3B` and "MAX" in gold `#C77D12` (on dark: white and `#F2B04A`), plus "FOODS GROUP" in small tracked caps.
- The Auramax colours appear **only** in the Auramax logo, never in Group 8 UI.

## 3. Colour

The page background is **Linen `#F5F2EA`**, with **white cards** on top. Sections can alternate with **Midnight `#161A3A`** dark bands, which is how the hero and closing slides are styled. All tokens are in `tokens.css`.

| Token | Hex | Role |
|---|---|---|
| Navy / Midnight | `#161A3A` | headings, text, dark sections, the 8's big ring |
| Signal | `#FF5A36` | brand orange for shapes, icons, bars and accents. **Not for small text on light backgrounds** (2.8:1) |
| Ember | `#C93A18` | orange **text** on light backgrounds: kickers, highlights (4.6:1) |
| Slate | `#5A6080` | secondary text and labels |
| Sub | `#4A5070` | paragraph and card body text |
| Linen | `#F5F2EA` | page background |
| White | `#FFFFFF` | cards |
| Mist | `#ECEEF6` | the 8's ring on dark; light tints |
| Muted on dark | `#AEB3D1` | secondary text on Midnight |
| Line | `#D9D5CB` | dividers, grey falling 8s |

**Roadmap phases** always appear in this order, with these colours:
- Stabilise: `#C93A18`
- Foundations: `#FF5A36`
- Build: `#5A6080`
- Scale: `#161A3A`

## 4. Typography

The fonts are Google Fonts; the link is in `tokens.css`.

- **Space Grotesk 700**: all titles. h1 44px, letter-spacing −1.2px, line-height 1.05; cover title 50px; big stats 40px. Scale them down on phones.
- **IBM Plex Sans**: body text at 400 (16–17px, line-height 1.45–1.5), and kickers and labels at 600.
- **Kicker** (above every section title): 13px, 600, UPPERCASE, letter-spacing 3px, Ember. Examples: "CASE INTRODUCTION", "DIAGNOSIS", "OUR RECOMMENDATION", "ROADMAP", "THE TEAM", "THANK YOU".
- **Sora 800**: only for the AURAMAX wordmark.

## 5. Recurring components (see `reference/`)

- **Section header:** kicker, then a big title, then an optional one-line intro in Slate.
- **White cards** with radius 14px and no shadow, sitting on Linen with 16–20px gaps.
- **Stat strip:** big number in Space Grotesk 40px with a small Slate label underneath; stats are separated by 1px `#D9D5CB` vertical rules.
- **Icon tiles:** a Linen rounded square (radius 9–20px) holding a simple line icon. Icons use navy strokes (round caps and joins) plus one orange accent.
- **Navy callout box:** white Space Grotesk text, with an orange kicker on the left.
- **Falling 8s:** small Group 8 marks drifting down like slow snow behind the hero. Most are `#D9D5CB` grey; about 1 in 7 are in the brand colours. Each takes 20–36s to fall, with gentle sway, and turns at most +50° so it never reads as ∞. Keep them away from text. They stand still under reduced motion. The CSS is in `tokens.css`.
- **Team photos:** circles about 96px with a 3px ring. The rings alternate Signal, Navy, Navy, Signal.
- **Phase chips and legend:** a coloured dot plus the phase name and timing.
- **Closing / space theme:** the rocket-8 flying on a dotted trail towards an Auramax planet with an orbit ring, small stars and sparkles, and the QR card in the centre.

## 6. Page content (use this copy; it matches the deck)

The suggested order mirrors the presentation: **Hero → Case → Diagnosis → Solution → Recommendations → Roadmap → Team → Closing/QR**.

### Hero
- Lockup: Group 8 × AURAMAX FOODS GROUP
- Title: **Balancing innovation and control**
- Subtitle: **A Hybrid Data Mesh for Auramax Foods Group**
- Lead: "Central rules where data is shared, regional freedom where it isn't. Group 8's data governance proposal for an acquisition-led, federated food company."
- Meta line: MIS41520 Strategic Data Management · UCD Michael Smurfit Graduate Business School

### Case introduction — "One enterprise on paper, many enterprises in data"
- **Profile:** Auramax Foods Group (AFG) is a European FMCG company that grew by acquiring strong regional manufacturers. Each region kept its own processes, IT systems and data definitions, so data never came together as one.
- **Stats:** €2.1B annual revenue · 7,500 employees · 12 countries
- **The problems they were having** (4 cards, each with one icon):

| Category | Problem | Supporting facts |
|---|---|---|
| Structure | Fragmented systems | 7 ERP instances across 12 countries; CRM live in only 5 countries; promotions tracked in spreadsheets |
| Quality | Unreliable core data | pack size missing or wrong for 10–16% of products; promotion mechanic free text in 35–45%; duplicate retailer IDs after acquisitions |
| Definitions & lineage | No shared meaning | several definitions of net sales and trade spend; local sales adjustments not documented; pipelines differ by region, lineage incomplete |
| Governance | No clear ownership | quality principles without decision rights; issues fixed locally, by hand; no one accountable for shared datasets end to end |

### Diagnosis — "Governance has swung between two extremes"
Show this as a horizontal axis from *More regional freedom* to *More central control*:
- **Too loose (2022–2026):** each region set its own data priorities, and acquisitions added more variation, leaving data siloed and fragmented.
- **PlanAssist:** an AI tool that forecasts demand for promoted products to guide weekly production. After a promising pilot in one region, it was rolled out to other regions on inconsistent data. It overestimated demand in three countries, causing overproduction and waste.
- **Too strict (after PlanAssist):** central controls slowed delivery, and regions worked around them with shadow datasets.
- **Hybrid Data Mesh:** the balance point we propose, in the middle of the axis.
- **Takeaway:** "Without a governance model that fits its federated structure, any digital initiative at AFG will inherit the same inconsistencies."

### Our recommendation — "A Hybrid Data Mesh for AFG"
*Central control depends on how widely data is shared across regions.*
- **Two councils:**
  - Corporate Data Council: global standards and contracts.
  - Regional Councils: local priorities.
- **Data products** (centrally owned and certified):
  - Product Master: pack size, shelf life.
  - Promotion & Trade: standard mechanics.
  - Sales History: built from regional data.
- **Regional data assets** (owned by the regions):
  - Supply Planning: regional operations.
  - Analytics Platform: regional reporting.
  - Sales & Invoicing: shared template.
  - Customer & Locations: global customer ID.
  - Sales & Invoicing and Customer & Locations both feed Sales History.
- **Data catalog:** every data product and asset, and who owns it.
- **PlanAssist** uses governed data products only.
- **Visual:** see `reference/04-solution-hybrid-data-mesh.png`. Central items sit in a solid panel and regional items in a dashed panel; arrows run into the catalog and then on to PlanAssist.

### Five recommendations
1. **Centralise Product Master and Promotion & Trade.** One shared version across regions: mandatory pack size, one shelf-life definition, standard promotion mechanics, complete funding fields.
2. **Build Sales History from regional data.** Regions keep producing their own sales data, but on common templates (SKU, customer, week) with a global customer ID and documented local adjustments.
3. **Govern through two tiers.** The Corporate Data Council sets standards for the three data products and minimum standards for everything else; Regional Councils own the rest.
4. **One central data catalog.** It lists every data product, asset and dataset, with owner, definitions, quality status and allowed use.
5. **PlanAssist on governed data only.** It uses only certified data products, with human review of promotion decisions until the data is trusted.

### Roadmap — "Foundations in 90 days, scale by month 18"
- **Four phases:**
  - Stabilise (Days 0–30)
  - Foundations (Days 30–90)
  - Build (Months 3–12)
  - Scale (Months 12–18)
- Add a **marker at day 90: "New governance in force"**.

| # | Initiative | Owner | Needs | Timing | KPI / outcome |
|---|---|---|---|---|---|
| 1 | Pause PlanAssist | PlanAssist owner | CEO decision | Days 0–30 | No decisions on ungoverned data |
| 2 | Assess councils, catalog and baselines | Chief Data Officer | – | Days 0–30 | Gap report and baselines approved |
| 3 | Set up the data councils | Chief Data Officer | 2 | Days 30–60 | Owners named for all 3 products |
| 4 | Minimum standards for regional data | Corporate Data Council | 3 | Days 45–90 | Central sign-off only for 3 products |
| 5 | Train owners; co-design templates | Regional Councils | 3 | Days 45–90 | Templates agreed by all regions |
| 6 | Design the 3 data products (canvases) | Data product owners | 3 | Days 45–90 | 3 canvases approved |
| 7 | Develop the data catalog (v1) | Data platform team | 2 | Days 30–90 | Catalog v1 ready for 3 products |
| 8 | Build Product Master, Promotion & Trade | Data product owners | 6 | Months 3–8 | ≥95% complete product & promo data |
| 9 | Build Sales History + global customer ID | Sales History owner | 5, 6 | Months 3–12 | Shared template and customer ID live |
| 10 | Data contracts and catalog roll-out | Data platform team | 7, 8, 9 | Months 8–12 | Contracts for 3 products in catalog |
| 11 | Restart PlanAssist, region by region | PlanAssist owner | 10 | Months 12–18 | Promotion ROI up vs. baseline |
| 12 | Extend catalog; onboard acquisitions | Regional Councils | 10 | Months 12–18 | ≥90% of data assets catalogued |

Show the 12 rows as a Gantt on desktop and as phase cards on phones.

### Team — "From 8 to ∞"
- **Intro:** [One sentence on who Group 8 is and what we bring to Auramax]
- **Members** (photo files in `assets/team/`):
  - Rafael Watson Gonzalez: `rafael.jpg`
  - Rhea Sachdeva: `rhea.jpg`
  - Wenjie Yi: `wenjie.jpg`
  - Ignacio Gorris Corrales: `ignacio.jpg`
- Each person's role is `[Role in the project]` for now.

### Closing — "Ready for launch"
- Kicker "THANK YOU"; the rocket-8 heading to the Auramax planet.
- Links: Executive report (PDF), Presentation slides (PDF), Project repository (GitHub). Hide any link that has no URL yet.
- Footer: Group 8 mark · "Group 8 · Data Strategy Proposal" · MIS41520 · UCD Smurfit.

## 7. Guardrails

- **Never publish student numbers.** The report cover has them, so upload a version without IDs if you link the report.
- Don't put the course case PDF or the student brief in the repo or on the site. The course forbids distributing them.
- Use only the facts and figures above; don't invent new ones.
- The fonts must load from Google Fonts. Include fallbacks.
- Give every image alt text; mark decorative SVGs `aria-hidden`.
- Text must meet AA contrast: Ember, not Signal, for orange text on light backgrounds.
