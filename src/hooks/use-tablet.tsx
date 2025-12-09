import * as React from "react";

const TABLET_MIN_WIDTH = 768;
const TABLET_MAX_WIDTH = 1023; // Up to but not including lg breakpoint (1024px)

export function useIsTablet() {
  // Initialize synchronously if we're on the client side
  const getInitialTabletState = () => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    return width >= TABLET_MIN_WIDTH && width <= TABLET_MAX_WIDTH;
  };

  const [isTablet, setIsTablet] = React.useState<boolean>(getInitialTabletState);

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      // Check if it's in tablet range (768px - 1023px width)
      // This matches Tailwind's md breakpoint (768px) to just before lg (1024px)
      const isTabletSize = 
        width >= TABLET_MIN_WIDTH && 
        width <= TABLET_MAX_WIDTH;
      
      setIsTablet(isTabletSize);
    };

    // Check immediately in case initial state was wrong
    checkTablet();
    window.addEventListener("resize", checkTablet);
    window.addEventListener("orientationchange", checkTablet);
    
    return () => {
      window.removeEventListener("resize", checkTablet);
      window.removeEventListener("orientationchange", checkTablet);
    };
  }, []);

  return isTablet;
}





