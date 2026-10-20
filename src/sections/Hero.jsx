import { project } from "../content.js";
import { Lockup, Mark8, EightShower } from "../components/Brand.jsx";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <EightShower className="hero__shower" count={22} avoidX={[14, 64]} />
      <EightShower className="hero__shower--phone" count={12} seed={18} colour={false} />
      <div className="container hero__inner">
        <div className="hero__text">
          <Lockup />
          <h1>{project.title}</h1>
          <p className="hero__subtitle">{project.subtitle}</p>
          <p className="lead">{project.lead}</p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="#solution">See the solution</a>
            <a className="btn btn--ghost" href="#team">Meet the team</a>
          </div>
          <p className="hero__meta">{project.course} · {project.school}</p>
        </div>
        <div className="hero__art" aria-hidden="true">
          <Mark8 height={340} stroke={11} className="hero__eight" />
        </div>
      </div>
    </section>
  );
}