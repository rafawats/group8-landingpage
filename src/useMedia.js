import { useEffect, useState } from "react";

/** True while the media query matches (e.g. the mobile layout), updating when the screen changes. */
export default function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query), on = () => setMatches(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

// Phones: the sections switch to their simpler mobile versions below this width.
export const MOBILE = "(max-width: 700px)";
