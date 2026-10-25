import { useEffect, useRef, useState } from "react";
import { recommendations, recommendationsFinale } from "../content.js";

const N = recommendations.length;
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Cards alternate navy and orange, starting with navy.
const tone = (i) => (i % 2 ? "signal" : "navy");

// Once the row has formed, each card throws out a burst of small balls in brand colours, left to right.
const BALLS = 14;
const COLOURS = ["#FF5A36", "#161A3A", "#C93A18", "#FF5A36", "#5A6080", "#161A3A", "#D9D5CB"];
// Fixed pseudo-random spread so every card's burst looks a little different but renders the same each time.
let seed = 8;
const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const BURST = Array.from({ length: N }, () => Array.from({ length: BALLS }, (_, i) => ({
  angle: ((i + rand() * 0.7) / BALLS) * Math.PI * 2, reach: 40 + rand() * 90,
  size: Math.round(6 + rand() * 9), colour: COLOURS[Math.floor(rand() * COLOURS.length)], lag: rand() * 0.25,
})));

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

// Scroll story, in "beats" of SEG × viewport height: beats 0…N-1 each bring one card up onto the deck,
// beat N spreads the deck out into the row, then a short hold before the section scrolls on.
const SEG = 0.85;   // each card's arrival, and the spread into the row, takes this much of a screen of scrolling
const LEAD = 0.6;   // the first card starts arriving while the stage is still 60% down the screen
const HOLD = 3.5;   // the finished row stays pinned for a while (balls, "Celebrate again") before the section moves on
const NAV = 64;

/** Where each card sits in the deck and in the row, for a stage of w × h whose pinned title takes the top `head` px. */
function slots(w, fullH, head) {
  const h = fullH - head;
  const wide = w >= 1000, cols = wide ? N : 2, gap = 12;
  const sw = Math.min(w, 860), sh = w < 600 ? 330 : 260;
  const cw = (w - gap * (cols - 1)) / cols, ch = wide ? 170 : 150;
  const rows = Math.ceil(N / cols), titleH = 64, gridH = rows * ch + gap * (rows - 1);
  const top = Math.max(titleH, (h - gridH + titleH) / 2);
  return Array.from({ length: N }, (_, i) => ({
    deck: { x: (w - sw) / 2, y: head + 16 + i * 16, w: sw, h: sh },
    row: { x: (i % cols) * (cw + gap), y: head + top + Math.floor(i / cols) * (ch + gap), w: cw, h: ch },
  }));
}

/** Balls that start hidden behind each card's centre and burst out past its edges, then fall away and fade. */
function Pops({ boxes }) {
  return (
    <div className="pops" aria-hidden="true">
      {boxes.map((b, ci) => (
        <span key={ci} className="pops__src" style={{ left: `${b.x + b.w / 2}px`, top: `${b.y + b.h / 2}px` }}>
          {BURST[ci].map((ball, bi) => {
            const cos = Math.cos(ball.angle), sin = Math.sin(ball.angle);
            // Distance from the centre to the card's edge in this direction, so every ball clears the card.
            const edge = Math.min(b.w / 2 / Math.abs(cos || 1e-6), b.h / 2 / Math.abs(sin || 1e-6));
            const d = edge + ball.reach;
            return (
              <span key={bi} className="pops__ball" style={{
                "--dx": `${Math.round(cos * d)}px`, "--dy": `${Math.round(sin * d)}px`, "--s": `${ball.size}px`,
                background: ball.colour, animationDelay: `${(ci * 0.18 + ball.lag).toFixed(2)}s`,
              }} />
            );
          })}
        </span>
      ))}
    </div>
  );
}

/** The five moves land one by one on a deck (each sweeping to navy or orange as it settles), then the deck
 *  spreads out into a row of all five and each card bursts out small balls. Everything follows the scroll position. */
function Deck({ reduced }) {
  const wrap = useRef(null), stage = useRef(null), head = useRef(null), cards = useRef([]);
  const [formed, setFormed] = useState(reduced);
  // Each time the row forms (scrolling down into it again counts), a new round of balls bursts out.
  const [round, setRound] = useState(0);
  const wasFormed = useRef(false);
  const [boxes, setBoxes] = useState([]);
  const rowBoxes = useRef([]);

  useEffect(() => {
    let raf = 0;
    const layout = () => {
      raf = 0;
      const st = stage.current, w = st.clientWidth, h = st.clientHeight, vh = window.innerHeight, seg = SEG * vh;
      const end = N + 1 + HOLD;
      // The wrapper is as tall as the stage plus the scrolling it stays pinned for.
      wrap.current.style.height = reduced ? "auto" : `${h + (end - LEAD / SEG) * seg}px`;
      const p = reduced ? end : Math.max(0, (NAV + LEAD * vh - wrap.current.getBoundingClientRect().top) / seg);
      const m = easeInOut(clamp(p - N));
      const hh = head.current.offsetHeight;
      st.style.setProperty("--head-h", `${hh}px`);
      const s = slots(w, h, hh);
      rowBoxes.current = s.map((x) => x.row);
      cards.current.forEach((el, i) => {
        const arrive = clamp(p - i), a = easeOut(arrive);
        const { deck, row } = s[i];
        const deckY = lerp(h + 40, deck.y, a);
        // Cards still on the deck sink back a little for every card that lands on top of them.
        let depth = 0;
        for (let j = i + 1; j < N; j++) depth += easeOut(clamp(p - j));
        const scale = 1 - depth * 0.035 * (1 - m);
        const x = lerp(deck.x, row.x, m), y = lerp(deckY, row.y, m);
        el.style.width = `${lerp(deck.w, row.w, m)}px`;
        el.style.height = `${lerp(deck.h, row.h, m)}px`;
        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        el.style.setProperty("--m", m.toFixed(3));
        el.style.setProperty("--depth", (depth * (1 - m)).toFixed(3));
        el.classList.toggle("is-stuck", arrive >= 0.98);
      });
      st.style.setProperty("--m", m.toFixed(3));
      if (m >= 0.98 && !wasFormed.current) {
        wasFormed.current = true; setFormed(true); setBoxes(rowBoxes.current);
        if (!reduced) setRound((r) => r + 1);
      }
      if (m < 0.6 && wasFormed.current) { wasFormed.current = false; setFormed(false); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(layout); };
    layout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <div className="deck" ref={wrap}>
      <div className="deck__stage" ref={stage}>
        {/* The section title stays pinned at the top while the cards stack and spread below it. */}
        <div className="deck__head" ref={head}>
          <p className="kicker">Recommendations</p>
          <h2 id="recs-title">Five moves to get there</h2>
        </div>
        <p className="deck__title" aria-hidden={!formed}>{recommendationsFinale}</p>
        {round > 0 && <Pops key={round} boxes={boxes} />}
        <ol className="deck__list">
          {recommendations.map((r, i) => (
            <li key={r.title} ref={(el) => (cards.current[i] = el)} className={`deck__card deck__card--${tone(i)}`}>
              <span className="deck__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ol>

        <button type="button" className="deck__again" tabIndex={formed ? 0 : -1} aria-hidden={!formed}
          onClick={() => { setBoxes(rowBoxes.current); setRound((r) => r + 1); }}>Celebrate again</button>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const [reduced] = useState(prefersReduced);
  return (
    <section className="section section--tint" id="recommendations" aria-labelledby="recs-title">
      <div className="container">
        <Deck reduced={reduced} />
      </div>
    </section>
  );
}
