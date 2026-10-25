import { useEffect, useState } from "react";
import { Mark8 } from "../components/Brand.jsx";
import { markNavJump } from "../useSectionGlide.js";

const links = [
  ["Home", "#top"], ["Problem", "#problem"], ["Solution", "#solution"], ["Recommendations", "#recommendations"],
  ["Roadmap", "#roadmap"], ["Team", "#team"], ["Thank you", "#launch"],
];
// Where a link lands, when that isn't simply the top of its section: the very top of the page for Home, and
// a little into the space scene for Thank you, so it opens already in full space.
const LAND = { "#top": () => 0, "#launch": (el) => window.scrollY + el.getBoundingClientRect().top + 0.45 * window.innerHeight };
// The hero section itself is pinned, so its progress is measured on the wrapper it scrolls through.
const MEASURE = { "#top": ".hero-pin" };
const READ_AT = 0.4;   // the section crossing 40% down the screen is the one being read

/** The nav marks where you are: the current section's link turns orange, and its underline fills as you scroll
 *  through that section. */
export default function Nav() {
  const [where, setWhere] = useState({ current: -1, progress: 0 });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * READ_AT;
      let current = -1, progress = 0;
      links.forEach(([, href], i) => {
        const r = document.querySelector(MEASURE[href] ?? href)?.getBoundingClientRect();
        if (r && r.top <= line && r.bottom > line) { current = i; progress = (line - r.top) / r.height; }
      });
      setWhere((w) => (w.current === current && Math.abs(w.progress - progress) < 0.002 ? w : { current, progress }));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const go = (e, href) => {
    markNavJump();
    const el = document.querySelector(href);
    if (!LAND[href] || !el) return;   // the rest use the normal anchor jump
    e.preventDefault();
    window.scrollTo({ top: LAND[href](el), behavior: "smooth" });
  };

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label="Group 8, back to top"><Mark8 height={26} />Group 8</a>
        <nav aria-label="Sections">
          <ul className="nav__links">
            {links.map(([t, h], i) => (
              <li key={h}>
                <a href={h} onClick={(e) => go(e, h)} className={i === where.current ? "is-current" : undefined} aria-current={i === where.current ? "location" : undefined}
                  style={i === where.current ? { "--prog": where.progress.toFixed(3) } : undefined}>{t}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
