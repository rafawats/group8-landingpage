import { recommendations } from "../content.js";

export default function Recommendations() {
  return (
    <section className="section section--tint" id="recommendations" aria-labelledby="recs-title">
      <div className="container">
        <p className="kicker">Recommendations</p>
        <h2 id="recs-title">Five moves to get there</h2>
        <ol className="recs">
          {recommendations.map((r, i) => (
            <li key={r.title} className="rec">
              <span className="rec__n">{i + 1}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
