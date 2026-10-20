import { resources, project } from "../content.js";
import { Rocket, AuramaxMark } from "../components/Brand.jsx";

function Stars() {
  let s = 18;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const stars = Array.from({ length: 46 }, () => ({ x: rand() * 100, y: rand() * 100, r: 0.8 + rand() * 1.6, o: 0.3 + rand() * 0.6 }));
  return (
    <svg className="stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {stars.map((st, i) => <ellipse key={i} cx={st.x} cy={st.y} rx={st.r / 10} ry={st.r / 6} fill="#ECEEF6" opacity={st.o} />)}
    </svg>
  );
}

export default function Launch() {
  const live = resources.filter((r) => r.href);
  return (
    <section className="section section--dark launch" id="launch" aria-labelledby="launch-title">
      <Stars />
      <div className="container launch__inner">
        <div className="launch__art" aria-hidden="true">
          <Rocket height={230} className="launch__rocket" />
          <div className="launch__planet"><AuramaxMark size={120} dark /></div>
        </div>
        <div className="launch__text">
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
    </section>
  );
}
