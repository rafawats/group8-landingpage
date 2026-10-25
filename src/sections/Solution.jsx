import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { mesh } from "../content.js";
import useMedia, { MOBILE } from "../useMedia.js";

// The build is pinned under the nav and driven by the scroll: each step takes SEG screen heights of scrolling,
// then HOLD more with the finished diagram before it moves on. The whole diagram is scaled to fit the space under
// the header and step bar and stays fixed; the scroll only adds its parts.
const NAV = 64;
const SEG = 0.9;
const HOLD = 1;
const SMOOTH_MS = 140;
const LAST = mesh.steps.length - 1;
// Catalog order: data products first, then regional assets. Each entry's delay is shared with its card's glow,
// so the entry lifts off its card just as the card lights up.
const ENTRIES = [
  ...mesh.products.map((c) => ({ ...c, kind: "product" })),
  ...mesh.assets.map((c) => ({ ...c, kind: "asset" })),
];
// Everything inside a step also follows the scroll. The mesh carries --x (scroll progress in steps, e.g. 3.4 is
// 40% into the catalog step) and each part starts at --s and takes --dur steps to come in (see .reveal in the CSS).
// Positions within a step are written as "beats" (the old seconds), BEAT steps each.
const BEAT = 0.15;
const at = (step, beat = 0) => step + beat * BEAT;
const entryBeat = (name) => 1.2 + ENTRIES.findIndex((e) => e.name === name) * 0.45;

/** A part of the diagram that comes in at step `at`, `delay` beats into it. */
function reveal(step, atStep, delay = 0) {
  return { className: "reveal", style: { "--s": at(atStep, delay) } };
}

/** A council being set up: its outline draws, the fill sweeps in, then its name and remit rise in. */
function Council({ kind, name, text, delay }) {
  return (
    <div className={`council council--${kind} council--build`} style={{ "--s": at(0, delay) }}>
      <svg className="council__trace" aria-hidden="true"><rect pathLength="1" rx="12" /></svg>
      <strong>{name}</strong><span>{text}</span>
    </div>
  );
}

function Card({ name, text, feeds, step, atStep, delay }) {
  const r = reveal(step, atStep, delay);
  return (
    <li className={`mesh-card ${r.className}`} style={{ ...r.style, "--es": at(3, entryBeat(name)) }}
      data-node={name === "Sales History" ? "sales-history" : undefined} data-feeds={feeds || undefined} data-entry-src={name}>
      <span className="mesh-card__name">{name}</span>
      <span className="mesh-card__text">{text}</span>
      {feeds && <span className="mesh-card__feeds">feeds Sales History</span>}
    </li>
  );
}

// Offset of `el` inside `root`, ignoring transforms (the reveal slide would otherwise skew the arrows).
function offsetIn(el, root) {
  let x = 0, y = 0;
  for (let n = el; n && n !== root; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** Elbow arrows from each feeding asset into Sales History: across the gap side by side, round the left gutter when stacked. */
function measureLinks(root) {
  const t = offsetIn(root.querySelector('[data-node="sales-history"]'), root);
  const feeds = [...root.querySelectorAll("[data-feeds]")];
  return feeds.map((el, i) => {
    const f = offsetIn(el, root);
    const fy = f.y + f.h / 2;
    const ty = t.y + (t.h * (i + 1)) / (feeds.length + 1);
    if (f.x > t.x + t.w) {
      const tx = t.x + t.w + 3, mx = (f.x + tx) / 2;
      return { d: `M ${f.x} ${fy} H ${mx} V ${ty} H ${tx}`, tip: [tx, ty], dir: -1 };
    }
    const gx = -8 - i * 5, tx = t.x - 3; // in the page gutter, clear of the boxes
    return { d: `M ${f.x} ${fy} H ${gx} V ${ty} H ${tx}`, tip: [tx, ty], dir: 1 };
  });
}

/** Where each catalog entry starts its glide: the centre of its card, relative to the entry's own resting place. */
function measureFlights(root) {
  const fly = {};
  root.querySelectorAll("[data-entry]").forEach((chip) => {
    const card = root.querySelector(`[data-entry-src="${chip.dataset.entry}"]`);
    const a = offsetIn(card, root), b = offsetIn(chip, root);
    fly[chip.dataset.entry] = { x: a.x + a.w / 2 - (b.x + b.w / 2), y: a.y + a.h / 2 - (b.y + b.h / 2) };
  });
  return fly;
}

/** Phones: instead of the diagram, one card per part of it explaining what happens there. Solid items are
 *  centrally controlled, dashed ones regionally, as in the diagram. Like the Recommendations deck, the section pins
 *  and each card slides up onto the stack over M_SEG screen heights of scrolling (the ones below sink back a
 *  little); the card on top gets the navy sweep. M_HOLD more before it moves on. */
const M_SEG = 0.85, M_HOLD = 1;
function MobileMesh() {
  const pin = useRef(null), stage = useRef(null), area = useRef(null), list = useRef(null);
  useEffect(() => {
    let raf = 0;
    const N = mesh.steps.length;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight, run = M_SEG * vh, areaH = area.current.clientHeight;
      pin.current.style.height = `${stage.current.offsetHeight + (N - 1 + M_HOLD) * run}px`;
      // The first card is already there when the section pins; each next one arrives over one beat.
      const p = (NAV - pin.current.getBoundingClientRect().top) / run;
      [...list.current.children].forEach((el, i) => {
        const a = i === 0 ? 1 : Math.min(1, Math.max(0, p - (i - 1)));
        const e = 1 - (1 - a) ** 3;
        let depth = 0;
        for (let j = i + 1; j < N; j++) depth += Math.min(1, Math.max(0, p - (j - 1)));
        el.style.transform = `translateY(${((1 - e) * (areaH + 40)).toFixed(1)}px) scale(${(1 - depth * 0.04).toFixed(3)})`;
        el.style.setProperty("--depth", Math.min(depth, 3).toFixed(3));
        el.classList.toggle("is-active", a >= 0.98 && depth < 0.5 && p > -0.6);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  const [corp, regional] = mesh.councils;
  const item = (kind, name, text, extra) => (
    <li key={name} className={`mcard__item mcard__item--${kind}`}><strong>{name}</strong>{text && <span>{text}</span>}{extra}</li>
  );
  const bodies = [
    <ul className="mcard__list">{item("central", corp.name, corp.text)}{item("regional", regional.name, regional.text)}</ul>,
    <ul className="mcard__list">{mesh.products.map((c) => item("central", c.name, c.text))}</ul>,
    <ul className="mcard__list">{mesh.assets.map((c) => item("regional", c.name, c.text, c.feeds && <em>↗ feeds Sales History</em>))}</ul>,
    <ul className="catalog__list mcard__chips">
      {ENTRIES.map((e) => <li key={e.name} className={`catalog__entry catalog__entry--${e.kind}`}>{e.name}<small>{mesh.owners[e.kind]}</small></li>)}
    </ul>,
    <ul className="mcard__list">
      <li className="mcard__item mcard__item--planassist"><strong>PlanAssist</strong><span>{mesh.planassist}</span></li>
      <li className="mcard__item mcard__item--future"><strong>{mesh.future.name}</strong>
        {mesh.future.options.map((o) => <span key={o.name}>→ <b>{o.name}</b> {o.text}</span>)}</li>
    </ul>,
  ];
  return (
    <div className="mpin" ref={pin}>
      <div className="mstage" ref={stage}>
        <p className="kicker">Our proposal</p>
        <h2 id="solution-title">A Hybrid Data Mesh</h2>
        <p className="lead">{mesh.intro}</p>
        <div className="mcards__area" ref={area}>
          <ol className="mcards" ref={list}>
            {mesh.steps.map((st, i) => (
              <li key={st.label} className="mcard" style={{ "--i": i, zIndex: i, top: `${i * 10}px`, maxHeight: `calc(100% - ${i * 10}px)` }}>
                <p className="mcard__step"><b>{i + 1}</b>{st.label}</p>
                <p className="mcard__text">{st.text}</p>
                {bodies[i]}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function Solution() {
  const [corp, regional] = mesh.councils;
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = useMedia(MOBILE);   // phones get explanation cards instead of the pinned diagram
  const [step, setStep] = useState(reduced ? LAST : -1);
  const [links, setLinks] = useState([]);
  const [fly, setFly] = useState({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const root = useRef(null), pin = useRef(null), stage = useRef(null), view = useRef(null), bar = useRef(null);

  // Scroll drives the step, the camera and the fill on the current step's pill.
  useEffect(() => {
    if (reduced || mobile) return;
    let raf = 0, last = 0, X = 0;
    const vh = () => window.innerHeight;
    const fit = () => {
      pin.current.classList.add("is-pinned");
      pin.current.style.height = `${stage.current.offsetHeight + (LAST + 1 + HOLD) * SEG * vh()}px`;
    };
    const target = () => (NAV - pin.current.getBoundingClientRect().top) / (SEG * vh());
    const draw = (x) => {
      const k = x < -0.3 ? -1 : Math.min(LAST, Math.floor(Math.max(x, 0)));
      setStep(k);
      const f = x < 0 ? 0 : k < LAST ? x - k : Math.min(1, x - LAST);
      bar.current.style.setProperty("--frac", f.toFixed(3));
      root.current.style.setProperty("--x", Math.max(-1, Math.min(LAST + 1, x)).toFixed(4));
      const viewH = view.current.clientHeight, meshH = root.current.offsetHeight;
      const fit = Math.min(1, (viewH - 32) / meshH);   // leaves room for its top margin
      root.current.style.transform = fit < 1 ? `scale(${fit.toFixed(4)})` : "";
    };
    const frame = (now) => {
      const dt = last ? now - last : 16;
      last = now;
      const tx = target();
      X += (tx - X) * (1 - Math.exp(-dt / SMOOTH_MS));
      draw(X);
      if (Math.abs(tx - X) > 0.0005) raf = requestAnimationFrame(frame);
      else { raf = 0; last = 0; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { fit(); onScroll(); };
    fit(); X = target(); draw(X);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, [reduced, mobile]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => { setSize({ w: el.offsetWidth, h: el.offsetHeight }); setLinks(measureLinks(el)); setFly(measureFlights(el)); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [mobile]);

  // Clicking a step scrolls to the start of it (or just shows it, when nothing is pinned).
  const goTo = (i) => {
    if (reduced) { setStep(i); return; }
    const top = window.scrollY + pin.current.getBoundingClientRect().top - NAV + (i + 0.05) * SEG * window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };
  const current = mesh.steps[Math.max(step, 0)];

  if (mobile) {
    return (
      <section className="section" id="solution" aria-labelledby="solution-title">
        <div className="container">
          <MobileMesh />
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="solution" aria-labelledby="solution-title">
      <div className="container">
        <div className="build build-pin" ref={pin}>
          <div className="build-stage" ref={stage}>
          {/* The section header stays pinned above the step bar while the diagram builds below. */}
          <div className="build__head">
            <p className="kicker">Our proposal</p>
            <h2 id="solution-title">A Hybrid Data Mesh</h2>
            <p className="lead">{mesh.intro}</p>
          </div>
          <div className="build__bar" ref={bar}>
            <ol className="build__steps">
              {mesh.steps.map((s, i) => (
                <li key={s.label}>
                  <button type="button" onClick={() => goTo(i)} aria-current={i === step ? "step" : undefined}
                    className={`build__step ${i === step ? "is-current" : ""} ${i < step ? "is-done" : ""}`}>
                    <b>{i + 1}</b><span>{s.label}</span>
                    {i === step && <i className="build__progress" />}
                  </button>
                </li>
              ))}
            </ol>
            <div className="build__caption" aria-live="polite"><p key={step}>{current.text}</p></div>
          </div>

          <div className="build__view" ref={view}>
          <div className="mesh" data-step={step} ref={root} style={reduced ? { "--x": LAST + 1 } : undefined} role="group" aria-label="Hybrid Data Mesh diagram">
            <div className="mesh__col">
              <Council kind="central" {...corp} delay={0.2} />
              <div className={`panel panel--central ${reveal(step, 1).className}`} style={{ ...reveal(step, 1).style, "--gs": at(4, 1.3) }}>
                <p className="panel__label"><b>Data products</b> · centrally owned and certified</p>
                <ul>{mesh.products.map((c, i) => <Card key={c.name} {...c} step={step} atStep={1} delay={0.5 + i * 0.45} />)}</ul>
              </div>
            </div>
            <div className="mesh__col">
              <Council kind="regional" {...regional} delay={2.6} />
              <div className={`panel panel--regional ${reveal(step, 2).className}`} style={{ ...reveal(step, 2).style, "--gs": at(4, 2.4) }}>
                <p className="panel__label"><b>Regional data assets</b> · owned by the regions</p>
                <ul>{mesh.assets.map((c, i) => <Card key={c.name} {...c} step={step} atStep={2} delay={0.5 + i * 0.45} />)}</ul>
              </div>
            </div>

            <svg className="mesh__links" width={size.w} height={size.h} aria-hidden="true">
              {links.map((l, i) => (
                <g key={i} style={{ "--s": at(2, 2.6 + i * 0.3) }}>
                  <path className="mesh__link" d={l.d} pathLength="1" />
                  <path className="mesh__link-flow" d={l.d} />
                  <path className="mesh__link-tip" d={`M ${l.tip[0]} ${l.tip[1]} l ${-l.dir * 9} -5 v 10 Z`} />
                </g>
              ))}
            </svg>

            <div className={`mesh__flow ${reveal(step, 3).className}`} style={reveal(step, 3).style} aria-hidden="true"><span /><span /></div>
            <div className={`catalog ${reveal(step, 3, 0.45).className}`} style={reveal(step, 3, 0.45).style}>
              <p className="catalog__head"><strong>Data catalog</strong><span>{mesh.catalog}</span></p>
              <ul className="catalog__list">
                {ENTRIES.map((e) => {
                  const r = reveal(step, 3, entryBeat(e.name));
                  return (
                    <li key={e.name} className={`catalog__entry catalog__entry--${e.kind} ${r.className}`} data-entry={e.name}
                      style={{ ...r.style, "--fx": `${fly[e.name]?.x ?? 0}px`, "--fy": `${fly[e.name]?.y ?? 0}px` }}>
                      {e.name}<small>{mesh.owners[e.kind]}</small>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mesh__consumers">
              <div className="consumer">
                <div className={`mesh__flow mesh__flow--single ${reveal(step, 4).className}`} style={reveal(step, 4).style} aria-hidden="true"><span /></div>
                <div className={`planassist ${reveal(step, 4, 0.6).className}`} style={reveal(step, 4, 0.6).style}>
                  <strong>PlanAssist</strong><span>{mesh.planassist}</span>
                </div>
              </div>
              <div className="consumer">
                <div className={`mesh__flow mesh__flow--single ${reveal(step, 4, 0.2).className}`} style={reveal(step, 4, 0.2).style} aria-hidden="true"><span /></div>
                <div className={`future ${reveal(step, 4, 0.8).className}`} style={reveal(step, 4, 0.8).style}>
                  <strong>{mesh.future.name}</strong>
                  <ul>
                    {mesh.future.options.map((o, i) => {
                      const r = reveal(step, 4, 1.5 + i * 0.45);
                      return (
                        <li key={o.name} className={`future__option future__option--${i ? "local" : "product"} ${r.className}`} style={r.style}>
                          <b>{o.name}</b><span>{o.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mesh__legend">
              <span><i className="swatch swatch--central" />Central control</span>
              <span><i className="swatch swatch--regional" />Regional control</span>
            </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
