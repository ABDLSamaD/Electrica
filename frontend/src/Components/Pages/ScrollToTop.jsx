import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // Instantly jumps to top
  }, [pathname]); // Runs when route changes

  return null;
}

export default ScrollToTop;
