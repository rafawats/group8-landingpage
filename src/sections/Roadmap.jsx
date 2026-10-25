import { useEffect, useRef, useState } from "react";
import { roadmap } from "../content.js";
import { Rocket } from "../components/Brand.jsx";

const TITLE = "Foundations in 90 days, scale by month 18";
// The title types on a timer once the section comes into view: a little uneven, with a breath after the comma.
const typeDelay = (i) => 42 + ((i * 37) % 45) + (TITLE[i - 1] === "," ? 260 : 0);
// Phase widths on the strip (same proportions as the desktop grid columns) and where each one starts.
const SPAN = [1, 2, 2, 1.4];
const START = SPAN.map((_, i) => SPAN.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = SPAN.reduce((a, b) => a + b, 0);
const DAY_90 = START[2];
const clamp = (v) => Math.min(1, Math.max(0, v));

// The roadmap itself follows the scroll while the section is pinned under the nav: the next SWEEP_RUN viewport
// heights of scrolling fill the strip, then ROCKET_RUN more launch the rocket, and after HOLD it scrolls on.
// If the section is too tall for the screen, the paragraphs share one slot and show only the phase being drawn.
const NAV = 64;
const SWEEP_RUN = 1.2;
const ROCKET_RUN = 0.6;   // in sweep lengths after the sweep ends
const HOLD = 0.3;         // in sweep lengths, so the rocket is clear before the section moves again
const SMOOTH_MS = 140;    // how quickly the drawing catches up with the scroll; smooths out wheel steps

// The launch path: a quadratic curve from the end of Scale, rising and leaning gently left (px from the anchor).
const P1 = [0, -170], P2 = [-150, -560];
const curve = (t) => [2 * (1 - t) * t * P1[0] + t * t * P2[0], 2 * (1 - t) * t * P1[1] + t * t * P2[1]];
const tangent = (t) => [2 * (1 - t) * P1[0] + 2 * t * (P2[0] - P1[0]), 2 * (1 - t) * P1[1] + 2 * t * (P2[1] - P1[1])];
// The rocket eases in like a real lift-off: slow off the pad, then picking up speed.
const lift = (r) => 0.45 * r * r * r + 0.55 * r * r;
const TRAIL = Array.from({ length: 22 }, (_, i) => (i + 1) / 23);

export default function Roadmap() {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [typed, setTyped] = useState(reduced ? TITLE.length : 0);
  const [typing, setTyping] = useState(false);
  const pin = useRef(null), stage = useRef(null);
  const title = useRef(null), track = useRef(null), marker = useRef(null), launch = useRef(null);
  const bars = useRef([]), paras = useRef([]);

  // Start typing the first time the title comes into view.
  useEffect(() => {
    if (reduced) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTyping(true); io.disconnect(); } },
      { rootMargin: "0px 0px -20% 0px" });
    io.observe(title.current);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!typing) return;
    if (typed >= TITLE.length) { setTyping(false); return; }
    const t = setTimeout(() => setTyped(typed + 1), typeDelay(typed));
    return () => clearTimeout(t);
  }, [typing, typed]);

  const retype = () => { setTyped(0); setTyping(true); };

  useEffect(() => {
    const trail = [...launch.current.querySelectorAll(".strip__trail")];
    const puffs = [...launch.current.querySelectorAll(".strip__puff")];
    const rocket = launch.current.querySelector(".strip__rocket");

    // X runs 0→1 over the sweep and on to 1 + ROCKET_RUN for the launch.
    const draw = (X) => {
      const P = clamp(X) * TOTAL;
      bars.current.forEach((el, i) => {
        const f = clamp((P - START[i]) / SPAN[i]);
        el.style.setProperty("--fill", f.toFixed(4));
        el.classList.toggle("is-lit", f > 0.3);
        paras.current[i].classList.toggle("is-in", f > 0.12);
      });
      // The phase being drawn right now (the compact layout shows only its paragraph).
      let current = 0;
      START.forEach((s0, i) => { if (P > s0 + 0.12 * SPAN[i]) current = i; });
      paras.current.forEach((el, i) => el.classList.toggle("is-current", i === current));
      track.current.style.setProperty("--head", (P / TOTAL).toFixed(4));
      track.current.classList.toggle("is-sweeping", X > 0.005 && X < 0.995);
      marker.current.classList.toggle("is-in", P >= DAY_90);

      // Park the launch point on the end of the Scale phase, wherever the layout puts it.
      const scale = bars.current[bars.current.length - 1];
      launch.current.style.left = `${scale.offsetLeft + scale.offsetWidth - 26}px`;
      launch.current.style.top = `${scale.offsetTop}px`;
      const r = clamp((X - 1) / ROCKET_RUN), t = lift(r);
      const [x, y] = curve(t), [dx, dy] = tangent(Math.max(t, 0.001));
      const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      rocket.style.opacity = clamp((X - 0.9) / 0.1).toFixed(3);
      rocket.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${angle.toFixed(2)}deg) scale(${(1 - 0.25 * t).toFixed(3)})`;
      trail.forEach((d, i) => d.classList.toggle("is-on", TRAIL[i] < t - 0.03));
      puffs.forEach((p, i) => {
        const k = clamp(r / 0.35);
        p.style.opacity = r > 0 ? (0.75 * (1 - k)).toFixed(3) : 0;
        p.style.transform = `translate(${(i - 1) * 16 * k}px, ${-6 * k}px) scale(${(0.3 + 2.2 * k).toFixed(3)})`;
      });
    };

    if (reduced) { draw(1); return; }

    const vh = () => window.innerHeight;
    // Always pin; if the full layout is taller than the space under the nav, switch to the compact one.
    // The wrapper gets the stage's height plus the scrolling it stays pinned for.
    const fit = () => {
      pin.current.classList.add("is-pinned");
      pin.current.classList.remove("is-compact");
      if (stage.current.offsetHeight + NAV > vh()) pin.current.classList.add("is-compact");
      pin.current.style.height = `${stage.current.offsetHeight + (1 + ROCKET_RUN + HOLD) * SWEEP_RUN * vh()}px`;
    };
    fit();
    const target = () => {
      const x = (NAV - pin.current.getBoundingClientRect().top) / (SWEEP_RUN * vh());
      return Math.min(Math.max(x, 0), 1 + ROCKET_RUN);
    };
    // Ease the drawn position towards the scroll position each frame, so it glides rather than jumps.
    let X = target(), raf = 0, last = 0;
    draw(X);
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <section className="section section--roadmap" id="roadmap" aria-labelledby="roadmap-title">
      <div className="roadmap-pin" ref={pin}>
        <div className="container roadmap-stage" ref={stage}>
          <p className="kicker">Roadmap</p>
          {/* The full title is laid out invisibly so the heading never changes size while it types. */}
          <h2 id="roadmap-title" ref={title} className={`typed ${typed >= TITLE.length ? "is-done" : ""}`} aria-label={TITLE}>
            <span className="typed__ghost" aria-hidden="true">{TITLE}</span>
            <span className="typed__text" aria-hidden="true">{TITLE.slice(0, typed)}<i className="typed__caret" /></span>
          </h2>
          <button type="button" className="typed__replay" onClick={retype} disabled={typing}>↻ Replay typing</button>
          <div className="roadmap-draw">
            <div className="strip" role="img" aria-label="Four phases: Stabilise days 0 to 30, Foundations days 30 to 90, Build months 3 to 12, Scale months 12 to 18. New governance in force from day 90.">
              <p className="strip__marker" ref={marker}>New governance in force · day 90</p>
              <div className="strip__track" ref={track}>
                <ol className="strip__phases">
                  {roadmap.map((p, i) => (
                    <li key={p.phase} ref={(el) => (bars.current[i] = el)} className={`strip__phase strip__phase--${p.color}`}>
                      <span className="strip__name">{p.phase}</span>
                      <span className="strip__when">{p.when}</span>
                    </li>
                  ))}
                </ol>
                <span className="strip__head" aria-hidden="true" />
                {/* Lift-off from the end of Scale: smoke puffs, a dotted trail along the path, and the 8-rocket. */}
                <div className="strip__launch" ref={launch} aria-hidden="true">
                  {TRAIL.map((t) => {
                    const [x, y] = curve(t);
                    return <span key={t} className="strip__trail" style={{ left: `${x}px`, top: `${y}px` }} />;
                  })}
                  {[0, 1, 2].map((i) => <span key={i} className="strip__puff" />)}
                  <div className="strip__rocket"><Rocket height={66} body="#161A3A" /></div>
                </div>
              </div>
            </div>
            <ol className="phases">
              {roadmap.map((p, i) => (
                <li key={p.phase} ref={(el) => (paras.current[i] = el)} className="phase">
                  <p className="phase__head"><i className={`dot dot--${p.color}`} /><b>{i + 1}. {p.phase}</b><span> · {p.when}</span></p>
                  <p>{p.text}</p>
                  <p className="phase__done"><b>Done when:</b> {p.done}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
