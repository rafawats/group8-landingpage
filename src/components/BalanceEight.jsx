import { balance } from "../content.js";

function Label({ part, kind }) {
  return (
    <p className={`balance__label balance__label--${kind}`}>
      <span className="balance__name"><i aria-hidden="true" />{part.name}</span>
      <span>{part.text}</span>
      <span className="balance__alone">{part.alone}</span>
    </p>
  );
}

// Droplets that splash out of the mix and get pulled back in: [colour, first offset, second offset] from the mixing point.
const DROPS = [
  ["#FF5A36", [-120, -30], [-90, 60]],
  ["#161A3A", [120, 40], [80, -70]],
  ["#161A3A", [20, -130], [-50, -110]],
  ["#FF5A36", [-20, 130], [60, 115]],
];

/** The hero 8 told as a story: the innovation ring and the control ring arrive apart, swirl together like liquid
 *  (a "gooey" blur + alpha-threshold filter makes them blob, bleed colour and throw droplets), then pull apart
 *  by colour into the Group 8 mark. A crisp copy of the exact mark fades in at the end, which is also all that
 *  shows with reduced motion. Rings are drawn at their final positions (3× scale, stroke 36); CSS moves them.
 *  With `scrub`, the 8s story is held still and played by the --t variable (0–1) instead of the clock. */
export default function BalanceEight({ scrub = false }) {
  const { innovation, control, solution } = balance;
  return (
    <figure className={`balance ${scrub ? "is-scrub" : ""}`}>
      <div className="balance__play">
        <div className="balance__stage">
          <svg viewBox="0 0 600 460" className="balance__svg" aria-hidden="true">
            <defs>
              <filter id="balance-goo" filterUnits="userSpaceOnUse" x="-50" y="-50" width="700" height="560">
                <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
                <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
              </filter>
            </defs>
            <g className="balance__goo" filter="url(#balance-goo)">
              <circle className="balance__ring balance__ring--control" cx="300" cy="296" r="90" />
              <circle className="balance__ring balance__ring--innovation" cx="300" cy="140" r="66" />
              {DROPS.map(([fill, [dx, dy], [dx2, dy2]], i) => (
                <circle key={i} className="balance__drop" cx="300" cy="218" r="13" fill={fill}
                  style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--dx2": `${dx2}px`, "--dy2": `${dy2}px`, "--d0": `${i * 0.08}s`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </g>
            <g className="balance__crisp">
              <circle cx="300" cy="296" r="90" stroke="#161A3A" />
              <circle cx="300" cy="140" r="66" stroke="#FF5A36" />
            </g>
            <circle className="balance__spark" cx="300" cy="206" r="20" />
          </svg>
          <Label part={innovation} kind="innovation" />
          <Label part={control} kind="control" />
        </div>
        <figcaption className="balance__solution">
          <span className="balance__kicker">{solution.kicker}</span>
          <strong>{solution.name}</strong>
          <span>{solution.text}</span>
        </figcaption>
      </div>
    </figure>
  );
}
