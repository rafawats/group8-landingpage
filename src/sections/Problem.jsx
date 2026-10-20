import { diagnosis as d } from "../content.js";
import { Mark8 } from "../components/Brand.jsx";

/** The governance pendulum: two extremes on an axis, PlanAssist as the swing between them. */
function Axis() {
  return (
    <svg className="axis" viewBox="0 0 1000 150" role="img" aria-label="Governance swung from too loose (regional freedom) to too strict (central control), pushed by PlanAssist. The balance point sits in the middle.">
      <defs>
        <marker id="swing-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#7E85A6" />
        </marker>
      </defs>
      <text x="500" y="22" textAnchor="middle" className="axis__label">The swing: PlanAssist</text>
      <path d="M 172 92 C 330 6, 670 6, 828 90" fill="none" stroke="#7E85A6" strokeWidth="2.5" strokeDasharray="7 8" markerEnd="url(#swing-head)" />
      <line x1="40" y1="108" x2="460" y2="108" stroke="#ECEEF6" strokeWidth="2.5" />
      <line x1="540" y1="108" x2="960" y2="108" stroke="#ECEEF6" strokeWidth="2.5" />
      <circle cx="167" cy="108" r="12" fill="#161A3A" stroke="#ECEEF6" strokeWidth="7" />
      <circle cx="833" cy="108" r="12" fill="#161A3A" stroke="#FF5A36" strokeWidth="7" />
      <g transform="translate(476 73)"><Mark8 height={70} bottom="#ECEEF6" /></g>
      <text x="40" y="140" className="axis__end">More regional freedom</text>
      <text x="960" y="140" textAnchor="end" className="axis__end">More central control</text>
    </svg>
  );
}

export default function Problem() {
  return (
    <section className="section section--dark" id="problem" aria-labelledby="problem-title">
      <div className="container">
        <p className="kicker">The problem</p>
        <h2 id="problem-title">Governance has swung between two extremes</h2>
        <p className="lead lead--dark">{d.claim}</p>
        <Axis />
        <div className="swing-grid">
          <article className="swing-card">
            <p className="swing-card__when">{d.loose.when}</p>
            <h3>{d.loose.title}</h3>
            <p>{d.loose.text}</p>
          </article>
          <article className="swing-card swing-card--accent">
            <p className="swing-card__when">The trigger</p>
            <h3>{d.swing.title}</h3>
            <p>{d.swing.text}</p>
          </article>
          <article className="swing-card">
            <p className="swing-card__when">{d.strict.when}</p>
            <h3>{d.strict.title}</h3>
            <p>{d.strict.text}</p>
          </article>
        </div>
        <blockquote className="takeaway">{d.takeaway}</blockquote>
      </div>
    </section>
  );
}
