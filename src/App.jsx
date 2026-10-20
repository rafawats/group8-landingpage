import Nav from "./sections/Nav.jsx";
import Hero from "./sections/Hero.jsx";
import Problem from "./sections/Problem.jsx";
import Solution from "./sections/Solution.jsx";
import Recommendations from "./sections/Recommendations.jsx";
import Roadmap from "./sections/Roadmap.jsx";
import Team from "./sections/Team.jsx";
import Launch from "./sections/Launch.jsx";
import Footer from "./sections/Footer.jsx";

export default function App() {
  return (
    <>
      <a className="skip" href="#problem">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Recommendations />
        <Roadmap />
        <Team />
        <Launch />
      </main>
      <Footer />
    </>
  );
}
