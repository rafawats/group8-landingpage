import { mesh } from "../content.js";

function Card({ name, text, feeds }) {
  return (
    <li className="mesh-card">
      <span className="mesh-card__name">{name}</span>
      <span className="mesh-card__text">{text}</span>
      {feeds && <span className="mesh-card__feeds">feeds Sales History</span>}
    </li>
  );
}

export default function Solution() {
  const [corp, regional] = mesh.councils;
  return (
    <section className="section" id="solution" aria-labelledby="solution-title">
      <div className="container">
        <p className="kicker">Our proposal</p>
        <h2 id="solution-title">A Hybrid Data Mesh</h2>
        <p className="lead">{mesh.intro}</p>

        <div className="mesh" role="group" aria-label="Hybrid Data Mesh diagram">
          <div className="mesh__col">
            <div className="council council--central"><strong>{corp.name}</strong><span>{corp.text}</span></div>
            <div className="panel panel--central">
              <p className="panel__label"><b>Data products</b> · centrally owned and certified</p>
              <ul>{mesh.products.map((c) => <Card key={c.name} {...c} />)}</ul>
            </div>
          </div>
          <div className="mesh__col">
            <div className="council council--regional"><strong>{regional.name}</strong><span>{regional.text}</span></div>
            <div className="panel panel--regional">
              <p className="panel__label"><b>Regional data assets</b> · owned by the regions</p>
              <ul>{mesh.assets.map((c) => <Card key={c.name} {...c} />)}</ul>
            </div>
          </div>
          <div className="mesh__flow" aria-hidden="true"><span /><span /></div>
          <div className="catalog"><strong>Data catalog</strong><span>{mesh.catalog}</span></div>
          <div className="mesh__flow mesh__flow--single" aria-hidden="true"><span /></div>
          <div className="planassist"><strong>PlanAssist</strong><span>{mesh.planassist}</span></div>
          <div className="mesh__legend">
            <span><i className="swatch swatch--central" />Central control</span>
            <span><i className="swatch swatch--regional" />Regional control</span>
          </div>
        </div>
      </div>
    </section>
  );
}
