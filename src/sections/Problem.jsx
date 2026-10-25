import { useEffect, useRef, useState } from "react";
import useMedia, { MOBILE } from "../useMedia.js";
import { diagnosis as d } from "../content.js";
import { AuramaxMark, Mark8 } from "../components/Brand.jsx";

// The swing is a pendulum: AFG hangs from a pivot far below the axis, so rotating it traces the PlanAssist arc.
// Pivot (500, 773), radius 733: ±27.02° lands exactly on the two ends of the axis at (167, 120) and (833, 120).
const ARC = "M 167 120 A 733 733 0 0 1 833 120";
// Fragments drifting off the loose end (silos), as offsets from the left end.
const SILOS = [[-92, -42], [-64, 28], [42, -58], [84, 30], [-22, -74], [112, -22], [-118, 6]];

/** The governance pendulum, drawn for one step of the story (0 loose, 1 PlanAssist fails while still loose,
 *  2 the swing to strict, 3 the missing middle). */
function Axis({ step }) {
  return (
    <svg className="axis" data-step={step} viewBox="0 -24 1000 250" role="img"
      aria-label="Governance swung from too loose (regional freedom) to too strict (central control), pushed by PlanAssist. The middle was missing: the Hybrid Data Mesh, where Group 8's two rings meet.">
      <defs>
        <marker id="swing-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#7E85A6" />
        </marker>
        <mask id="swing-reveal" maskUnits="userSpaceOnUse" x="0" y="-24" width="1000" height="250">
          <path className="axis__reveal" d={ARC} pathLength="1" fill="none" stroke="#fff" strokeWidth="30" />
        </mask>
      </defs>

      <text x="500" y="0" textAnchor="middle" className="axis__label">The swing: PlanAssist</text>
      <path d={ARC} mask="url(#swing-reveal)" fill="none" stroke="#7E85A6" strokeWidth="2.5" strokeDasharray="7 8" markerEnd="url(#swing-head)" />

      <line x1="40" y1="120" x2="460" y2="120" stroke="#ECEEF6" strokeWidth="2.5" />
      <line x1="540" y1="120" x2="960" y2="120" stroke="#ECEEF6" strokeWidth="2.5" />

      <g className="axis__silos" transform="translate(167 120)">
        {SILOS.map(([x, y], i) => (
          <rect key={i} x={x - 6} y={y - 6} width="12" height="12" rx="3" fill={i % 3 ? "#5A6080" : "#FF5A36"}
            style={{ animationDelay: `${-i * 0.7}s` }} />
        ))}
      </g>
      <g className="axis__clamp" transform="translate(833 120)">
        <path className="axis__clamp-l" d="M -30 -30 L -40 -30 L -40 30 L -30 30" />
        <path className="axis__clamp-r" d="M 30 -30 L 40 -30 L 40 30 L 30 30" />
      </g>

      {/* The two ends: innovation (Signal ring, regional freedom) and control (Mist ring, central control). */}
      <circle className="axis__end-ring axis__end-ring--loose" cx="167" cy="120" r="12" fill="#161A3A" stroke="#FF5A36" strokeWidth="7" />
      <circle className="axis__end-ring axis__end-ring--strict" cx="833" cy="120" r="12" fill="#161A3A" stroke="#ECEEF6" strokeWidth="7" />

      {/* The missing middle: an empty slot, then a ring from each end stacks into the 8 (mark at 0.6 scale). */}
      <g className="axis__slot">
        <circle cx="500" cy="106" r="34" fill="none" stroke="#7E85A6" strokeWidth="2.5" strokeDasharray="6 7" />
        <text x="500" y="116" textAnchor="middle">?</text>
      </g>
      <g className="axis__eight">
        <circle className="axis__eight-bottom" cx="500" cy="121" r="18" fill="none" stroke="#ECEEF6" strokeWidth="7.2" />
        <circle className="axis__eight-top" cx="500" cy="90" r="13.2" fill="none" stroke="#FF5A36" strokeWidth="7.2" />
      </g>

      {/* PlanAssist (step 1): rolled out while governance was still loose; it fails on the inconsistent data. */}
      <g className="axis__pa">
        <circle className="axis__pa-ring" cx="167" cy="120" r="34" />
        <text x="167" y="66" textAnchor="middle" className="axis__pa-label">PlanAssist rollout</text>
      </g>

      <g className="axis__ball">
        <circle cx="500" cy="40" r="24" fill="#161A3A" />
        <g transform="translate(481 21)"><AuramaxMark size={38} dark /></g>
      </g>

      <text x="40" y="180" className="axis__end">More regional freedom</text>
      <text x="960" y="180" textAnchor="end" className="axis__end">More central control</text>
      <g className="axis__balance">
        <text x="500" y="182" textAnchor="middle" className="axis__balance-title">{d.balance.title}</text>
        <text x="500" y="210" textAnchor="middle" className="axis__balance-text">{d.balance.text}</text>
      </g>
    </svg>
  );
}

const STEPS = [
  { when: d.loose.when, title: d.loose.title, text: d.loose.text },
  { when: "The trigger", title: d.swing.title, text: d.swing.text, extra: d.swing.effect, accent: true },
  { when: d.strict.when, title: d.strict.title, text: d.strict.text },
  { when: d.missing.when, title: d.missing.title, text: d.missing.text, accent: true },
];

const NAV = 64;

export default function Problem() {
  const [step, setStep] = useState(-1);   // -1: the story hasn't started (the intro is still folding away)
  const steps = useRef(null);
  const mobile = useMedia(MOBILE);   // phones: no axis diagram, just the timeline (see the mobile CSS)

  // A reading line below the pinned header and axis drives the story: the timeline rail fills down to it,
  // every point it has reached lights up, and the last point reached sets the diagram's step.
  useEffect(() => {
    let raf = 0, leadFull = 0;
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
    // The intro's full height, measured with the fold undone (once, and again on resize).
    const measure = () => {
      const lead = steps.current.parentElement.querySelector(".story__lead"), h = lead.style.height;
      lead.style.height = "";
      leadFull = lead.offsetHeight;
      lead.style.height = h;
    };
    const update = () => {
      raf = 0;
      const ol = steps.current, top = ol.getBoundingClientRect().top;
      // Once the header is pinned, the intro sentence fades and folds away over the first quarter-screen of
      // scrolling, so the axis sits right under the title.
      const story = ol.parentElement, lead = story.querySelector(".story__lead");
      // On phones nothing is pinned, so the intro simply stays and the timeline is live straight away.
      const k = mobile ? 1 : Math.min(1, Math.max(0, (NAV - story.getBoundingClientRect().top) / (0.25 * window.innerHeight)));
      lead.style.height = mobile ? "" : `${(leadFull * (1 - k)).toFixed(1)}px`;
      lead.style.opacity = mobile ? "" : (1 - Math.min(1, k * 1.6)).toFixed(3);
      lead.style.marginTop = mobile ? "" : `${(10 * (1 - k)).toFixed(1)}px`;
      story.querySelector(".story__stage").style.setProperty("--fold", k.toFixed(3));   // tightens the pinned header too
      // The reading line sits in the free space under the pinned header, far enough down that a card lights up
      // while it is fully in view rather than tucked against the diagram.
      const vh = window.innerHeight, stageBottom = ol.parentElement.querySelector(".story__stage").getBoundingClientRect().bottom;
      // On phones the header isn't pinned (it scrolls away), so the line simply sits 60% down the screen.
      const line = mobile ? vh * 0.6 : Math.min(vh * 0.85, Math.max(vh * 0.45, stageBottom + Math.max(150, (vh - stageBottom) * 0.42)));
      const nodes = [...ol.querySelectorAll(".story__node")].map((n) => { const r = n.getBoundingClientRect(); return r.top + r.height / 2; });
      const first = nodes[0], lastY = nodes[nodes.length - 1];
      ol.style.setProperty("--rail-top", `${first - top}px`);
      ol.style.setProperty("--rail-h", `${lastY - first}px`);
      // Nothing starts until the intro has fully folded away; then the fill follows the reading line.
      const ready = k >= 1;
      ol.style.setProperty("--fill", ready ? Math.min(1, Math.max(0, (line - first) / (lastY - first))).toFixed(4) : 0);
      const passed = ready ? nodes.filter((y) => y - 22 <= line).length : 0;   // lit as soon as the fill touches the point
      [...ol.children].forEach((li, i) => li.classList.toggle("is-passed", i < passed));
      setStep(passed - 1);
      // The swing follows the scroll: between the PlanAssist point and the Too strict point, AFG moves along the
      // arc from regional freedom to central control (0 → 1), and the warning fades as it goes.
      const axis = story.querySelector(".axis");
      const swing = ready ? Math.min(1, Math.max(0, (line - (nodes[1] - 22)) / (nodes[2] - nodes[1]))) : 0;
      axis.style.setProperty("--swing", swing.toFixed(4));
      axis.classList.toggle("is-wobbling", passed === 2 && swing < 0.04);
      // The last card holds still on the reading line (it is sticky within its long stretch) while the scroll
      // plays the missing middle: the empty slot pulses, then a ring from each end glides in to form the 8.
      const lastLi = ol.lastElementChild, item = lastLi.querySelector(".story__item");
      const holdTop = line - item.offsetHeight / 2;
      item.style.setProperty("--hold", `${holdTop.toFixed(0)}px`);
      const lr = lastLi.getBoundingClientRect(), pad = parseFloat(getComputedStyle(lastLi).paddingTop);
      const p = ready ? clamp((holdTop - lr.top - pad) / (lr.height - pad - item.offsetHeight)) : 0;
      axis.style.setProperty("--slot", (p < 0.05 ? p / 0.05 : p < 0.35 ? 1 : clamp(1 - (p - 0.35) / 0.15)).toFixed(3));
      axis.style.setProperty("--eight", ease(clamp((p - 0.3) / 0.45)).toFixed(4));
      axis.style.setProperty("--eight-on", clamp((p - 0.28) / 0.05).toFixed(3));
      axis.style.setProperty("--bal", clamp((p - 0.75) / 0.15).toFixed(3));
      const take = story.querySelector(".story__takeaway");
      story.querySelector(".story__quote").classList.toggle("is-in", take.getBoundingClientRect().top < line);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    measure(); update();
    document.fonts?.ready.then(onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, [mobile]);

  return (
    <section className="section section--dark" id="problem" aria-labelledby="problem-title">
      <div className="container">
        <div className="story">
          {/* The header stays pinned with the axis while the timeline scrolls past underneath. */}
          <div className="story__stage">
            <p className="kicker">The problem</p>
            <h2 id="problem-title">Governance has swung between two extremes</h2>
            <p className="lead lead--dark story__lead">{d.claim}</p>
            <Axis step={step} />
            {/* The takeaway opens up here, inside the pinned header, once the timeline has been read. */}
            <blockquote className="takeaway story__quote">{d.takeaway}</blockquote>
          </div>
          <ol className="story__steps" ref={steps}>
            {STEPS.map((s, i) => (
              <li key={s.title} data-step={i} className={`story__step ${i === step ? "is-active" : ""}`}>
                {/* The point sits on the card's own middle; the last one, the missing middle, is the Group 8 mark. */}
                <div className="story__item">
                  {i === STEPS.length - 1
                    ? <span className="story__node story__node--eight" aria-hidden="true"><Mark8 height={34} bottom="#ECEEF6" /></span>
                    : <span className="story__node" aria-hidden="true">{i + 1}</span>}
                  <article className={`swing-card ${s.accent ? "swing-card--accent" : ""}`}>
                    <p className="swing-card__when">{s.when}</p>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    {s.extra && <p>{s.extra}</p>}
                  </article>
                </div>
              </li>
            ))}
          </ol>
          {/* Scrolling room for the takeaway: while this passes, the quote shows under the pinned diagram. */}
          <div className="story__takeaway" aria-hidden="true" />
          {/* Phones: the takeaway simply follows the timeline. */}
          <blockquote className="takeaway story__quote-mobile">{d.takeaway}</blockquote>
        </div>
      </div>
    </section>
  );
}
