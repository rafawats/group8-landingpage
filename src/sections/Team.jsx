import { useEffect, useRef, useState } from "react";
import { team, teamHint, teamTitle } from "../content.js";
import { Mark8 } from "../components/Brand.jsx";

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// The 8 animations a card can play on hover; each hover picks one at random (never the same twice in a row).
const FX = ["rise", "orbit", "burst", "infinity"];
const NUDGE_MS = 2600;    // while nobody is hovering, the cards take turns giving a gentle nudge
const BURST = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.round(Math.cos(a) * 92), y: Math.round(Math.sin(a) * 92) };
});

// Hover backgrounds: each member has their own pattern built from the Group 8 mark, in its on-dark colours
// (Signal small ring, Mist big ring) and kept faint so the name and photo stay readable.
const SIGNAL = "#FF5A36", MIST = "#ECEEF6";
const PATTERN_OF = ["ripple", "chain", "halftone", "shower"];   // by member, in team order

// Chain: interlocking ∞ (the mark on its side), staggered rows, as a tiling background that glides sideways.
const infinity = (x, y) =>
  `<g transform='translate(${x} ${y}) rotate(90) scale(.3) translate(-40 -58)'>` +
  `<circle cx='40' cy='28' r='22' fill='none' stroke='${SIGNAL}' stroke-opacity='.5' stroke-width='12'/>` +
  `<circle cx='40' cy='80' r='30' fill='none' stroke='${MIST}' stroke-opacity='.18' stroke-width='12'/></g>`;
const CHAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='70' height='72'>${infinity(35, 18) + infinity(0, 54) + infinity(70, 54)}</svg>`)}")`;

// Halftone: a dot grid where dots swell near the outline of one giant 8 (exact mark proportions, 1.7×).
const BIG = { top: [100, 67.6, 37.4], bottom: [100, 156, 51] };
const HALFTONE = [];
for (let y = 6; y < 240; y += 10) {
  for (let x = 5; x < 200; x += 10) {
    const near = (c) => Math.abs(Math.hypot(x - c[0], y - c[1]) - c[2]);
    const dt = near(BIG.top), db = near(BIG.bottom), d = Math.min(dt, db);
    const r = d < 14 ? 3.4 - d * 0.19 : 0.7;
    HALFTONE.push({ x, y, r: +r.toFixed(2), c: d < 14 ? (dt < db ? SIGNAL : MIST) : MIST, o: d < 14 ? (dt < db ? 0.55 : 0.3) : 0.12 });
  }
}

// Shower: mini 8s falling down the card (fixed pseudo-random spread so it renders the same every time).
let seed = 8;
const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const SHOWER = Array.from({ length: 14 }, () => ({
  x: Math.round(rand() * 92), h: Math.round(12 + rand() * 14), dur: (6 + rand() * 5).toFixed(1), delay: (-rand() * 10).toFixed(1),
}));

function Pattern({ kind }) {
  if (kind === "ripple") {
    return (
      <svg className="pat pat--ripple" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice">
        <g>{Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx="100" cy="80" r={52 + i * 22} fill="none" stroke={i % 2 ? MIST : SIGNAL}
            strokeOpacity={i % 2 ? 0.14 : 0.32} strokeWidth="7" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}</g>
      </svg>
    );
  }
  if (kind === "chain") return <span className="pat pat--chain" style={{ backgroundImage: CHAIN }} />;
  if (kind === "halftone") {
    return (
      <svg className="pat pat--halftone" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice">
        {HALFTONE.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} fillOpacity={d.o} style={{ animationDelay: `${(d.y * 0.004).toFixed(3)}s` }} />
        ))}
      </svg>
    );
  }
  return (
    <span className="pat pat--shower">
      {SHOWER.map((f, i) => (
        <span key={i} style={{ left: `${f.x}%`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}>
          <Mark8 height={f.h} top={SIGNAL} bottom={MIST} />
        </span>
      ))}
    </span>
  );
}

/** The Group 8 mark, or the brand's infinity (group8-infinity.svg: the same rings side by side), drawn as two
 *  rings that trace themselves in. Exact geometry: 80 × 116 upright, 116 × 80 as infinity, stroke 12. */
function TitleMark({ className, infinity = false }) {
  return infinity ? (
    <svg className={className} viewBox="0 0 116 80" aria-hidden="true">
      <circle className="tm__top" cx="28" cy="40" r="22" pathLength="1" />
      <circle className="tm__bottom" cx="80" cy="40" r="30" pathLength="1" />
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 80 116" aria-hidden="true">
      <circle className="tm__top" cx="40" cy="28" r="22" pathLength="1" />
      <circle className="tm__bottom" cx="40" cy="80" r="30" pathLength="1" />
    </svg>
  );
}

/** "From 8 to ∞", starting as plain type. First the plain 8 turns into the branded mark (its rings draw over it as
 *  the digit dissolves), then the plain ∞ does the same with the brand's infinity. It is scrubbed by the scroll:
 *  the Team section sets the CSS variables on this heading from its progress (see titleVars). */
function EightTitle({ innerRef }) {
  return (
    <h2 id="team-title" ref={innerRef} className="eight-title" aria-label={teamTitle.label}>
      <span className="et__run" aria-hidden="true">
        <span className="et__word">{teamTitle.from}</span>{" "}
        <span className="et__glyph et__glyph--eight">
          <span className="et__plain">8</span>
          <TitleMark className="et__mark" />
        </span>{" "}
        <span className="et__word">{teamTitle.to}</span>{" "}
        <span className="et__glyph et__glyph--inf">
          <span className="et__plain">∞</span>
          <TitleMark className="et__mark et__mark--inf" infinity />
        </span>
      </span>
    </h2>
  );
}

const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const seg = (t, a, b) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
/** Title progress t (0–1) as CSS variables: words in, then the 8 (rings a/b, dissolve d), then the ∞. */
const titleVars = (t) => ({
  "--w": seg(t, 0, 0.2),
  "--a1": seg(t, 0.25, 0.5), "--b1": seg(t, 0.32, 0.6), "--d1": seg(t, 0.3, 0.6),
  "--a2": seg(t, 0.6, 0.82), "--b2": seg(t, 0.66, 0.92), "--d2": seg(t, 0.62, 0.9),
});

function Avatar({ name, photo }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  return photo && !failed
    ? <img src={photo} alt={`Photo of ${name}`} width="112" height="112" onError={() => setFailed(true)} />
    : <span className="avatar__initials" aria-hidden="true">{initials}</span>;
}

/** The 8 animation for one hover. It is remounted on every hover, so it always plays from the start. */
function Fx({ kind }) {
  if (kind === "burst") {
    return (
      <span className="fx fx--burst" aria-hidden="true">
        {BURST.map((b, i) => (
          <span key={i} style={{ "--x": `${b.x}px`, "--y": `${b.y}px`, animationDelay: `${i * 0.03}s` }}>
            <Mark8 height={16} bottom="#ECEEF6" />
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className={`fx fx--${kind}`} aria-hidden="true">
      <span className="fx__arm"><span className="fx__mark"><Mark8 height={kind === "orbit" ? 30 : 40} bottom="#ECEEF6" /></span></span>
    </span>
  );
}

// The Team section is one scroll story, pinned under the nav, in beats of SPOT_RUN viewport heights:
// TITLE_U beats play "From 8 to ∞", CARDS_U beats bring the four cards in one by one, then each member takes
// the spotlight for one beat, and after HOLD the section moves on. Hovering any card takes over from the spotlight.
const NAV = 64;
const SPOT_RUN = 0.55;
const TITLE_U = 2, CARDS_U = 1.2;
const HOLD = 0.25;  // after the spotlight all turn navy; the very next scroll lets go and glides on to space
const SMOOTH_MS = 140;   // the drawing eases after the scroll position, so wheel steps glide

function Member({ m, i, shown, nudge, spot, group, onHover }) {
  const [hovered, setHovered] = useState(false);
  const [play, setPlay] = useState(null);   // { kind, n }: the 8 animation for the current turn in the spotlight
  const n = useRef(0), last = useRef(null);
  const active = hovered || spot || group;
  // Every time the card becomes active (hover or its turn in the spotlight), pick a fresh 8 animation.
  useEffect(() => {
    if (!active) { setPlay(null); return; }
    const options = FX.filter((k) => k !== last.current);
    const kind = options[Math.floor(Math.random() * options.length)];
    last.current = kind;
    setPlay({ kind, n: ++n.current });
  }, [active]);
  const enter = () => { setHovered(true); onHover(true); };
  const leave = () => { setHovered(false); onHover(false); };
  return (
    <li className={`member ${shown ? "is-shown" : ""} ${active ? "is-active" : ""} ${group && !hovered ? "is-group" : ""} ${nudge ? "is-nudge" : ""}`} style={{ "--i": i }}>
      <a className="member__link" href={m.linkedin} target="_blank" rel="noopener noreferrer"
        aria-label={`${m.name} on LinkedIn (opens in a new tab)`}
        onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
        {/* Keyed by turn so its entrance replays each time; it stays mounted to fade out afterwards. */}
        <span className="member__pattern" aria-hidden="true">{n.current > 0 && <Pattern key={n.current} kind={PATTERN_OF[i % PATTERN_OF.length]} />}</span>
        <span className={`avatar avatar--${i % 3 === 0 ? "signal" : "navy"}`}>
          {play && <Fx key={play.n} kind={play.kind} />}
          <span className="avatar__ripple" aria-hidden="true" />
          <svg className="avatar__ring" viewBox="0 0 112 112" aria-hidden="true"><circle cx="56" cy="56" r="54.5" pathLength="1" /></svg>
          <span className="avatar__photo"><Avatar {...m} /></span>
          <span className="avatar__cta" aria-hidden="true"><b>in</b><small>LinkedIn</small></span>
          <span className="avatar__badge" aria-hidden="true">in</span>
        </span>
        <h3>{m.name}</h3>
        {m.role && <p>{m.role}</p>}
      </a>
    </li>
  );
}

/** The team: cards rise in one by one; then, pinned, each member takes the spotlight in turn as you scroll
 *  (navy card, their pattern, an 8 animation). Hover works any time; when idle the cards nudge for attention. */
/** The team: pinned, the scroll first plays the title, then brings the cards in, then spotlights each member
 *  (navy card, their pattern, an 8 animation). Hover works any time; when idle the cards nudge for attention. */
export default function Team() {
  const [reduced] = useState(prefersReduced);
  const [shown, setShown] = useState(reduced ? team.length : 0);   // how many cards are in
  const [nudge, setNudge] = useState(-1);
  const [hovering, setHovering] = useState(false);
  const [spot, setSpot] = useState(-1);
  const [group, setGroup] = useState(false);   // after the last spotlight: everyone turns navy together
  const pin = useRef(null), stage = useRef(null), title = useRef(null);

  useEffect(() => {
    const setTitle = (t) => Object.entries(titleVars(t)).forEach(([k, v]) => title.current.style.setProperty(k, v.toFixed(4)));
    if (reduced) { setTitle(1); return; }
    let pinned = false, raf = 0, last = 0;
    const vh = () => window.innerHeight;
    const total = TITLE_U + CARDS_U + team.length;
    // Pin when the section fits under the nav. If it doesn't, the same story plays as the section scrolls up.
    const fit = () => {
      pinned = stage.current.offsetHeight + NAV <= vh();
      pin.current.classList.toggle("is-pinned", pinned);
      pin.current.style.height = pinned ? `${stage.current.offsetHeight + (total + HOLD) * SPOT_RUN * vh()}px` : "";
    };
    // Progress in beats.
    const target = () => {
      const run = SPOT_RUN * vh();
      const x = pinned
        ? (NAV - pin.current.getBoundingClientRect().top) / run
        : (0.85 * vh() - stage.current.getBoundingClientRect().top) / run;
      return Math.min(Math.max(x, 0), total + HOLD);
    };
    const draw = (X) => {
      setTitle(Math.min(1, X / TITLE_U));
      const c = (X - TITLE_U) / CARDS_U;
      setShown(team.filter((_, i) => c > i / team.length).length);
      const p = X - TITLE_U - CARDS_U;
      setSpot(p >= 0 && p < team.length ? Math.floor(p) : -1);
      setGroup(p >= team.length);
    };
    let X = 0;
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
  }, [reduced]);

  // Outside the spotlight (once everyone is in), nudge one card at a time, pausing while someone is hovered.
  const allIn = shown === team.length;
  const idle = allIn && !reduced && !hovering && spot < 0 && !group;
  useEffect(() => {
    if (!idle) { setNudge(-1); return; }
    const first = setTimeout(() => setNudge(0), 2200);
    const t = setInterval(() => setNudge((k) => (k + 1) % team.length), NUDGE_MS);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [idle]);

  return (
    <section className="section section--tint section--team" id="team" aria-labelledby="team-title">
      <div className="team-pin" ref={pin}>
        <div className="container team-stage" ref={stage}>
          <div className="team__head">
            <p className="kicker">The team</p>
            <EightTitle innerRef={title} />
            <p className={`team__hint ${allIn ? "is-in" : ""}`}>
              <span className="team__hint--hover">{teamHint.hover}</span>
              <span className="team__hint--touch">{teamHint.touch}</span>
            </p>
          </div>
          <ul className="team">
            {team.map((m, i) => (
              <Member key={m.name} m={m} i={i} shown={i < shown} nudge={nudge === i} spot={!hovering && spot === i} group={!hovering && group} onHover={setHovering} />
            ))}
          </ul>
          {/* Which member is in the spotlight. */}
          <ol className={`team__steps ${spot >= 0 && !hovering ? "is-on" : ""}`} aria-hidden="true">
            {team.map((m, i) => <li key={m.name} className={i === spot ? "is-current" : i < spot ? "is-done" : ""} />)}
          </ol>
        </div>
      </div>
    </section>
  );
}
