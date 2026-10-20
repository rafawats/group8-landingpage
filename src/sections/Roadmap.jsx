import { roadmap } from "../content.js";

export default function Roadmap() {
  return (
    <section className="section" id="roadmap" aria-labelledby="roadmap-title">
      <div className="container">
        <p className="kicker">Roadmap</p>
        <h2 id="roadmap-title">Foundations in 90 days, scale by month 18</h2>
        <div className="strip" role="img" aria-label="Four phases: Stabilise days 0 to 30, Foundations days 30 to 90, Build months 3 to 12, Scale months 12 to 18. New governance in force from day 90.">
          <p className="strip__marker">New governance in force · day 90</p>
          <ol className="strip__phases">
            {roadmap.map((p) => (
              <li key={p.phase} className={`strip__phase strip__phase--${p.color}`}>
                <span className="strip__name">{p.phase}</span>
                <span className="strip__when">{p.when}</span>
              </li>
            ))}
          </ol>
        </div>
        <ol className="phases">
          {roadmap.map((p, i) => (
            <li key={p.phase} className="phase">
              <p className="phase__head"><i className={`dot dot--${p.color}`} /><b>{i + 1}. {p.phase}</b><span> · {p.when}</span></p>
              <p>{p.text}</p>
              <p className="phase__done"><b>Done when:</b> {p.done}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
