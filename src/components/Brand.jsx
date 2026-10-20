// Brand marks drawn as SVG so they stay sharp at any size.

/** The Group 8 mark: a small orange ring on a larger ring. */
export function Mark8({ height = 24, top = "#FF5A36", bottom = "#161A3A", stroke = 12, title, className, style }) {
  const width = (height * 80) / 116;
  return (
    <svg width={width} height={height} viewBox="0 0 80 116" className={className} style={style}
      role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <circle cx="40" cy="28" r="22" fill="none" stroke={top} strokeWidth={stroke} />
      <circle cx="40" cy="80" r="30" fill="none" stroke={bottom} strokeWidth={stroke} />
    </svg>
  );
}

/** The Auramax Foods Group icon (ring + leaf). */
export function AuramaxMark({ size = 24, dark = false, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 132 132" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d="M 127 66 A 61 61 0 1 1 66 5" fill="none" stroke={dark ? "#F2B04A" : "#C77D12"} strokeWidth="11" />
      <path d="M 106 26 A 78 78 0 0 0 28 104 A 78 78 0 0 0 106 26 Z" fill={dark ? "#FFFFFF" : "#1E4D3B"} />
      <path d="M 42.25 89.75 L 91.75 40.25" fill="none" stroke={dark ? "#161A3A" : "#FFFFFF"} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** "Group 8 × AURAMAX" partnership lockup. */
export function Lockup({ dark = false }) {
  return (
    <div className={`lockup ${dark ? "lockup--dark" : ""}`} role="img" aria-label="Group 8 and Auramax Foods Group">
      <span className="lockup__g8"><Mark8 height={26} bottom={dark ? "#ECEEF6" : "#161A3A"} />Group 8</span>
      <span className="lockup__x" aria-hidden="true">×</span>
      <span className="lockup__aura"><AuramaxMark size={26} dark={dark} /><span>AURA<b>MAX</b></span></span>
    </div>
  );
}

/** The Group 8 mark as a rocket: nose cone on the orange ring, fins on the big ring, flame below. */
export function Rocket({ height = 220, body = "#ECEEF6", className }) {
  return (
    <svg viewBox="0 0 120 220" height={height} width={(height * 120) / 220} className={className} aria-hidden="true">
      <path d="M 46 150 Q 60 228 74 150 Q 60 158 46 150 Z" fill="#FF5A36" className="rocket__flame" />
      <path d="M 53 152 Q 60 196 67 152 Q 60 156 53 152 Z" fill="#FFD3BF" className="rocket__flame" />
      <path d="M 32 100 L 8 158 L 36 146 Z" fill="#C93A18" />
      <path d="M 88 100 L 112 158 L 84 146 Z" fill="#C93A18" />
      <path d="M 60 2 Q 79 17 79 33 L 41 33 Q 41 17 60 2 Z" fill="#C93A18" />
      <circle cx="60" cy="60" r="22" fill="none" stroke="#FF5A36" strokeWidth="12" />
      <circle cx="60" cy="112" r="30" fill="none" stroke={body} strokeWidth="12" />
    </svg>
  );
}

/** A deterministic sprinkle of small 8s (mostly faint, a few in brand colours). */
export function EightShower({ count = 26, seed = 8, className, avoid = [0, 0, 0, 0] }) {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const [ax0, ay0, ax1, ay1] = avoid;            // box to keep clear, in % of the shower area
  const items = [];
  for (let i = 0; items.length < count && i < count * 6; i++) {
    const it = { x: rand() * 96, y: rand() * 94, h: 10 + rand() * 18, r: rand() * 50 - 25, colour: items.length % 7 === 3 };
    if (it.x > ax0 && it.x < ax1 && it.y > ay0 && it.y < ay1) continue;
    items.push(it);
  }
  return (
    <div className={`shower ${className ?? ""}`} aria-hidden="true">
      {items.map((it, i) => (
        <Mark8 key={i} height={it.h} top={it.colour ? "#FF5A36" : "#D9D5CB"} bottom={it.colour ? "#161A3A" : "#D9D5CB"}
          style={{ position: "absolute", left: `${it.x}%`, top: `${it.y}%`, transform: `rotate(${it.r}deg)` }} />
      ))}
    </div>
  );
}
