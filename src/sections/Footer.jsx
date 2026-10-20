import { Mark8 } from "../components/Brand.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand"><Mark8 height={22} />Group 8</span>
        <p>Group 8 is a student team at UCD Michael Smurfit Graduate Business School, 2026. Auramax Foods Group is the case company for this project.</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
