import { useEffect, useRef, useState } from "react";
import { resources, project } from "../content.js";
import { Rocket } from "../components/Brand.jsx";

// The closing is a pinned, full-screen space scene that plays over SCENE_VH screen heights of scrolling:
// navy spreads out from the centre until the whole screen is space, the Auramax planet appears with its ring
// turning, the 8-rocket flies in and loops round the planet leaving a dotted trail, docks beside it, and the
// thank-you fades in. The flight takes most of the scene, so it moves slowly with the scroll.
const SCENE_VH = 6.5;
const HOLD_VH = 3;     // the finished scene (rocket docked, thank-you showing) stays pinned this long before the footer
const SMOOTH_MS = 140;
const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const seg = (u, a, b) => ease(clamp((u - a) / (b - a)));

// The rocket's flight, as points on the screen (0–1 of width and height), joined by a smooth curve:
// in from the bottom left, a loop round the planet (centred at 80% / 45%), then docking just left of it, nose up.
const FLIGHT = [
  [-0.12, 1.08], [0.16, 0.82], [0.4, 0.66], [0.6, 0.3], [0.8, 0.13], [0.94, 0.38],
  [0.88, 0.7], [0.7, 0.8], [0.56, 0.7], [0.66, 0.52],
];
// On narrow screens the planet sits top right (78% / 18%), so the loop is tighter and it docks just below it.
const FLIGHT_NARROW = [
  [-0.2, 1.06], [0.2, 0.86], [0.5, 0.62], [0.36, 0.34], [0.56, 0.1], [0.9, 0.06],
  [0.96, 0.24], [0.8, 0.36], [0.6, 0.38], [0.62, 0.28],
];
/** Point and direction on the Catmull-Rom curve through the flight points at t (0–1), scaled to a w × h screen. */
function flight(t, w, h) {
  const pts = w < 700 ? FLIGHT_NARROW : FLIGHT;
  const n = pts.length - 1, f = Math.min(t, 0.99999) * n, i = Math.floor(f), u = f - i;
  const p = (k) => pts[Math.max(0, Math.min(n, k))];
  const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
  const at = (d) => {
    const a = p0[d], b = p1[d], c = p2[d], e = p3[d];
    const pos = 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - e) * u * u + (-a + 3 * b - 3 * c + e) * u ** 3);
    const vel = 0.5 * ((-a + c) + 2 * (2 * a - 5 * b + 4 * c - e) * u + 3 * (-a + 3 * b - 3 * c + e) * u * u);
    return [pos, vel];
  };
  const [x, vx] = at(0), [y, vy] = at(1);
  return { x: x * w, y: y * h, angle: (Math.atan2(vx * w, -vy * h) * 180) / Math.PI };
}
const TRAIL = Array.from({ length: 80 }, (_, i) => i / 80);

// Fixed pseudo-random stars and sparkles, so the sky is the same on every visit.
let seed = 18;
const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const STARS = Array.from({ length: 70 }, () => ({ x: rand() * 100, y: rand() * 100, r: 0.8 + rand() * 1.8, o: 0.3 + rand() * 0.6, tw: rand() < 0.35 }));
const SPARKLES = [[12, 18, "#FF5A36"], [24, 30, "#FF5A36"], [58, 12, "#ECEEF6"], [70, 86, "#FF5A36"], [92, 66, "#ECEEF6"], [40, 92, "#ECEEF6"]];

/** The Auramax icon as a planet: its gold ring turns slowly around the leaf; a moon circles the orbit ring. */
function Planet() {
  return (
    <div className="space__planet">
      <span className="space__orbit"><span className="space__moon" /></span>
      <svg viewBox="0 0 132 132" aria-hidden="true">
        <circle cx="66" cy="66" r="66" fill="#161A3A" />
        <g className="space__ring"><path d="M 127 66 A 61 61 0 1 1 66 5" fill="none" stroke="#F2B04A" strokeWidth="11" /></g>
        <path d="M 106 26 A 78 78 0 0 0 28 104 A 78 78 0 0 0 106 26 Z" fill="#FFFFFF" />
        <path d="M 42.25 89.75 L 91.75 40.25" fill="none" stroke="#161A3A" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Launch() {
  const live = resources.filter((r) => r.href);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pin = useRef(null), stage = useRef(null), rocket = useRef(null), trail = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    let raf = 0, last = 0, u = 0, w = 0, h = 0;
    const draw = (v) => {
      const st = stage.current.style;
      // The takeover is quick (the first ~5% of the scene) so arriving here never feels empty.
      st.setProperty("--night", seg(v, 0, 0.05).toFixed(4));
      st.setProperty("--sky", seg(v, 0.02, 0.09).toFixed(4));
      st.setProperty("--planet", seg(v, 0.05, 0.13).toFixed(4));
      st.setProperty("--end", seg(v, 0.86, 0.97).toFixed(4));
      // The flight runs at an even pace from 9% to 90% of the scene, slowing only as it docks.
      const r = clamp((v - 0.09) / 0.81), x = (r - 0.85) / 0.15;
      const t = r < 0.85 ? r : 0.85 + 0.15 * (x + x * x - x ** 3), f = flight(t, w, h);   // same speed into the final 15%, then easing to a stop
      rocket.current.style.opacity = clamp((v - 0.09) / 0.03).toFixed(3);
      rocket.current.style.transform = `translate(${f.x.toFixed(1)}px, ${f.y.toFixed(1)}px) rotate(${f.angle.toFixed(2)}deg)`;
      [...trail.current.children].forEach((d, i) => d.classList.toggle("is-on", v > 0.09 && TRAIL[i] < t - 0.012));
    };
    const fit = () => {
      w = stage.current.clientWidth; h = stage.current.clientHeight;
      setSize({ w, h });
      pin.current.style.height = reduced ? "" : `${h + (SCENE_VH + HOLD_VH) * window.innerHeight}px`;
    };
    fit();
    if (reduced) { draw(1); return; }
    const target = () => clamp(-pin.current.getBoundingClientRect().top / (SCENE_VH * window.innerHeight));
    const frame = (now) => {
      const dt = last ? now - last : 16;
      last = now;
      const tu = target();
      u += (tu - u) * (1 - Math.exp(-dt / SMOOTH_MS));
      draw(u);
      if (Math.abs(tu - u) > 0.0005) raf = requestAnimationFrame(frame);
      else { raf = 0; last = 0; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { fit(); draw(u); onScroll(); };
    u = target(); draw(u);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <section className={`space ${reduced ? "is-static" : ""}`} id="launch" aria-labelledby="launch-title">
      <div className="space__pin" ref={pin}>
        <div className="space__stage" ref={stage}>
          <div className="space__night" aria-hidden="true" />
          <div className="space__sky" aria-hidden="true">
            <svg className="stars" viewBox="0 0 100 100" preserveAspectRatio="none">
              {STARS.map((s, i) => (
                <ellipse key={i} className={s.tw ? "is-twinkle" : undefined} cx={s.x} cy={s.y} rx={s.r / 10} ry={s.r / 6}
                  fill="#ECEEF6" opacity={s.o} style={{ animationDelay: `${(i % 7) * 0.6}s` }} />
              ))}
            </svg>
            {SPARKLES.map(([x, y, c], i) => (
              <span key={i} className="space__sparkle" style={{ left: `${x}%`, top: `${y}%`, color: c, animationDelay: `${i * 0.7}s` }}>✦</span>
            ))}
          </div>
          <Planet />
          <div className="space__trail" ref={trail} aria-hidden="true">
            {TRAIL.map((t) => {
              const p = flight(t, size.w, size.h);
              return <span key={t} style={{ left: `${p.x}px`, top: `${p.y}px` }} />;
            })}
          </div>
          <div className="space__rocket" ref={rocket} aria-hidden="true"><Rocket height={120} body="#ECEEF6" /></div>

          <div className="space__content">
            <p className="kicker">Thank you</p>
            <h2 id="launch-title">Ready for launch</h2>
            <p className="lead lead--dark">Thanks for reading. Questions or feedback on the proposal are very welcome.</p>
            {live.length > 0 ? (
              <ul className="resources">
                {live.map((r) => (
                  <li key={r.label}><a className="btn btn--primary" href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{r.label}<small> · {r.note}</small></a></li>
                ))}
              </ul>
            ) : (
              <p className="resources__soon">The report and slides will be available here after the presentation.</p>
            )}
            <p className="launch__meta">{project.course} · {project.school}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
