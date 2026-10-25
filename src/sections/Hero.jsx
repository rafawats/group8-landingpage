import { useEffect, useRef, useState } from "react";
import { project } from "../content.js";
import { Lockup, EightShower } from "../components/Brand.jsx";
import BalanceEight from "../components/BalanceEight.jsx";

// The hero's 8 story is played by the scroll. On load it runs on its own up to INTRO (the two rings and their
// labels arriving, apart), so the page never opens empty; from there the hero stays pinned and the next RUN
// screen heights of scrolling play the rest: the rings mixing like liquid, splitting into the 8, the caption.
// Then it holds for HOLD more before moving on, like the other pinned sections.
const INTRO = 0.36;
const INTRO_MS = 2800;
const RUN = 2;
const HOLD = 1.2;   // the finished 8 and its caption stay pinned this many screens before the Problem section
const NAV = 64;
const SMOOTH_MS = 140;
const clamp = (v) => Math.min(1, Math.max(0, v));

export default function Hero() {
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const pin = useRef(null), hero = useRef(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0, last = 0, s = 0, intro = 0, t0 = 0, stopped = false, lead = 0;
    const vh = () => window.innerHeight;
    // Pin the hero; if it is taller than the screen, it pins by its bottom edge so all of it has been seen.
    // `lead` is how far it scrolls before it sticks (0 when it fits); the 8 only starts moving once it is pinned.
    const fit = () => {
      const h = hero.current.offsetHeight, top = Math.min(NAV, vh() - h);
      hero.current.style.top = `${top}px`;
      lead = NAV - top;
      pin.current.style.height = `${h + lead + (RUN + HOLD) * vh()}px`;
    };
    const target = () => clamp((NAV - lead - pin.current.getBoundingClientRect().top) / (RUN * vh()));
    // Before any scrolling the intro plays on its own; once scrolling starts, it carries on from INTRO.
    const draw = () => {
      const introT = intro * INTRO;
      const t = s > 0.0005 ? Math.max(introT, INTRO + s * (1 - INTRO)) : introT;
      hero.current.style.setProperty("--t", t.toFixed(4));
    };
    const frame = (now) => {
      if (stopped) return;
      const dt = last ? now - last : 16;
      last = now;
      t0 ||= now;
      intro = 1 - (1 - clamp((now - t0) / INTRO_MS)) ** 3;   // eases out
      const ts = target();
      s += (ts - s) * (1 - Math.exp(-dt / SMOOTH_MS));
      draw();
      if (intro < 1 || Math.abs(ts - s) > 0.0005) raf = requestAnimationFrame(frame);
      else { raf = 0; last = 0; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { fit(); onScroll(); };
    fit(); s = target();
    raf = requestAnimationFrame(frame);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { stopped = true; window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <div className="hero-pin" ref={pin}>
      <section className={`hero ${reduced ? "" : "is-pinned"}`} id="top" ref={hero}>
        <EightShower className="hero__shower" count={30} avoidX={[24, 72]} />   {/* both sides, clear of the centred 8 */}
        <EightShower className="hero__shower--phone" count={12} seed={18} colour={false} />
        <div className="container hero__inner">
          <div className="hero__text">
            {/* Kept deliberately short: the logos, the title, and the innovation-and-control 8. */}
            <Lockup large />
            <h1>{project.title}</h1>
          </div>
          <div className="hero__art">
            <BalanceEight scrub={!reduced} />
          </div>
        </div>
      </section>
    </div>
  );
}
