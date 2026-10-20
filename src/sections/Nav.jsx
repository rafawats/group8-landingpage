import { Mark8 } from "../components/Brand.jsx";

const links = [["Problem", "#problem"], ["Solution", "#solution"], ["Roadmap", "#roadmap"], ["Team", "#team"]];

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label="Group 8, back to top"><Mark8 height={26} />Group 8</a>
        <nav aria-label="Sections">
          <ul className="nav__links">{links.map(([t, h]) => <li key={h}><a href={h}>{t}</a></li>)}</ul>
        </nav>
        <a className="btn btn--small btn--primary" href="#launch">Resources</a>
      </div>
    </header>
  );
}
