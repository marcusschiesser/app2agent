import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// General media query hook for any breakpoint
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);

      const updateMatches = () => {
        setMatches(media.matches);
      };

      // Set initial value
      updateMatches();

      // Setup listeners
      if (media.addEventListener) {
        media.addEventListener("change", updateMatches);
        return () => media.removeEventListener("change", updateMatches);
      } else {
        // Fallback for older browsers
        media.addListener(updateMatches);
        return () => media.removeListener(updateMatches);
      }
    }
    return undefined;
  }, [query]);

  return matches;
}
