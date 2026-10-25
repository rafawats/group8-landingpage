import { useEffect } from "react";

// Each pinned section's scroll ends when its sticky stage lets go and starts moving up. Scrolling down past that
// moment, the page glides on to the start of the next section by itself.
// [the section's sticky stage, the section to glide to, how far into it to land (screen heights, optional)]
const CHAIN = [
  ["#top", "#problem"],
  ["#problem .story__stage", "#solution"],
  ["#solution .build-stage", "#recommendations"],
  ["#solution .mstage", "#recommendations"],          // the phone version of the proposal
  ["#recommendations .deck__stage", "#roadmap"],
  ["#roadmap .roadmap-stage", "#team"],
  ["#team .team-stage", "#launch", 0.45],   // straight into full space: past the navy takeover and stars
];
const NAV = 64;
const GLIDE_MS = 1100;   // ignore further triggers while the glide is under way

// While the nav is taking the reader somewhere, the scroll passes through sections; don't glide on the way.
let navJumpUntil = 0;
export function markNavJump() {
  navJumpUntil = Date.now() + 2500;
  window.addEventListener("scrollend", () => { navJumpUntil = 0; }, { once: true });
}

export default function useSectionGlide() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lastY = window.scrollY, gliding = 0, raf = 0;
    const ended = new Map();   // stage → had it already let go on the last check?
    const check = () => {
      raf = 0;
      const y = window.scrollY, down = y > lastY;
      lastY = y;
      CHAIN.forEach(([from, to, into = 0]) => {
        const end = document.querySelector(from), next = document.querySelector(to);
        if (!end || !next) return;
        // Let go = it is sticky (pinned on this screen) but now sits above its sticky top.
        const css = getComputedStyle(end), r = end.getBoundingClientRect();
        const past = css.position === "sticky" && r.top < parseFloat(css.top) - 1;
        // Only a fresh crossing while scrolling down, with the section still on screen (so a jump from the nav,
        // which skips over sections, doesn't set it off), and the next section not already in place.
        if (past && ended.get(end) === false && down && r.bottom > 0 && !gliding && Date.now() > navJumpUntil) {
          // Land where the next section's own pinned story begins (past its top padding).
          const target = window.scrollY + next.getBoundingClientRect().top + parseFloat(getComputedStyle(next).paddingTop) - NAV + into * window.innerHeight;
          if (target > y + 4) {
            gliding = window.setTimeout(() => { gliding = 0; }, GLIDE_MS);
            window.scrollTo({ top: target, behavior: "smooth" });
          }
        }
        ended.set(end, past);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); clearTimeout(gliding); };
  }, []);
}
