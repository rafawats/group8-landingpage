import { useState } from "react";
import { team } from "../content.js";

function Avatar({ name, photo, ring }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className={`avatar avatar--${ring}`}>
      {photo && !failed
        ? <img src={photo} alt={`Photo of ${name}`} width="112" height="112" onError={() => setFailed(true)} />
        : <span aria-hidden="true">{initials}</span>}
    </div>
  );
}

export default function Team() {
  return (
    <section className="section section--tint" id="team" aria-labelledby="team-title">
      <div className="container">
        <p className="kicker">The team</p>
        <h2 id="team-title">The people behind Group 8</h2>
        <ul className="team">
          {team.map((m, i) => (
            <li key={m.name} className="member">
              <Avatar {...m} ring={i % 3 === 0 ? "signal" : "navy"} />
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
