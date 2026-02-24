/**
 * Animation Context Provider
 * 
 * Provides global animation state and utilities for the portfolio website.
 * Manages scroll progress, current section tracking, reduced motion detection,
 * and GSAP/ScrollTrigger plugin registration.
 * 
 * Requirements: 3.3, 3.5, 13.5
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Animation timeline registry entry
 */
interface TimelineEntry {
  timeline: gsap.core.Timeline;
  isVisible: boolean;
}

/**
 * Animation Context value interface
 */
export interface AnimationContextValue {
  /** Normalized scroll position (0-1) */
  scrollProgress: number;
  /** Currently active section identifier */
  currentSection: string;
  /** Whether user prefers reduced motion */
  isReducedMotion: boolean;
  /** Register an animation timeline for lifecycle management */
  registerAnimation: (id: string, timeline: gsap.core.Timeline) => void;
  /** Unregister an animation timeline */
  unregisterAnimation: (id: string) => void;
  /** Pause animations outside viewport to conserve resources (Req 13.5) */
  setAnimationVisibility: (id: string, isVisible: boolean) => void;
  /** Update the current section identifier */
  setCurrentSection: (section: string) => void;
}

/**
 * Props for AnimationProvider component
 */
export interface AnimationProviderProps {
  children: ReactNode;
  /** Initial section to set as current */
  initialSection?: string;
}


// Create context with undefined default (will be provided by AnimationProvider)
const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

/**
 * Detects if user prefers reduced motion
 * @returns true if user has enabled reduced motion preference
 */
function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Calculates normalized scroll progress (0-1)
 * @param scrollY - Current scroll position
 * @param documentHeight - Total document height
 * @param viewportHeight - Viewport height
 * @returns Normalized scroll progress between 0 and 1
 */
export function calculateScrollProgress(
  scrollY: number,
  documentHeight: number,
  viewportHeight: number
): number {
  // Handle edge cases
  if (documentHeight <= viewportHeight) return 0;
  if (scrollY < 0) return 0;
  
  const maxScroll = documentHeight - viewportHeight;
  if (maxScroll <= 0) return 0;
  
  const progress = scrollY / maxScroll;
  
  // Clamp to 0-1 range (Requirement 3.5)
  return Math.max(0, Math.min(1, progress));
}

/**
 * Animation Provider Component
 * 
 * Provides animation context to the entire application, managing:
 * - Scroll progress tracking
 * - Current section detection
 * - Reduced motion preference
 * - Animation timeline lifecycle
 */
export function AnimationProvider({
  children,
  initialSection = 'hero',
}: AnimationProviderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [isReducedMotion, setIsReducedMotion] = useState(getReducedMotionPreference);
  
  // Registry for animation timelines
  const timelinesRef = useRef<Map<string, TimelineEntry>>(new Map());


  /**
   * Register an animation timeline for lifecycle management
   */
  const registerAnimation = useCallback((id: string, timeline: gsap.core.Timeline) => {
    timelinesRef.current.set(id, { timeline, isVisible: true });
    
    // If reduced motion is enabled, pause the timeline immediately
    if (isReducedMotion) {
      timeline.pause();
    }
  }, [isReducedMotion]);

  /**
   * Unregister an animation timeline and clean up
   */
  const unregisterAnimation = useCallback((id: string) => {
    const entry = timelinesRef.current.get(id);
    if (entry) {
      entry.timeline.kill();
      timelinesRef.current.delete(id);
    }
  }, []);

  /**
   * Set animation visibility - pauses animations outside viewport (Req 13.5)
   */
  const setAnimationVisibility = useCallback((id: string, isVisible: boolean) => {
    const entry = timelinesRef.current.get(id);
    if (entry) {
      entry.isVisible = isVisible;
      
      // Pause animations outside viewport to conserve resources
      if (!isVisible && !entry.timeline.paused()) {
        entry.timeline.pause();
      } else if (isVisible && entry.timeline.paused() && !isReducedMotion) {
        entry.timeline.resume();
      }
    }
  }, [isReducedMotion]);

  /**
   * Listen for reduced motion preference changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setIsReducedMotion(event.matches);
      
      // Pause/resume all animations based on preference
      timelinesRef.current.forEach((entry) => {
        if (event.matches) {
          entry.timeline.pause();
        } else if (entry.isVisible) {
          entry.timeline.resume();
        }
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);


  /**
   * Set up scroll progress tracking
   */
  useEffect(() => {
    let rafId: number | null = null;
    
    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      const progress = calculateScrollProgress(scrollY, documentHeight, viewportHeight);
      setScrollProgress(progress);
      rafId = null;
    };

    const handleScroll = () => {
      // Use requestAnimationFrame for throttled scroll handling (Req 13.4)
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScrollProgress);
      }
    };

    // Initial calculation
    updateScrollProgress();

    // Use native scroll event with RAF throttling
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for resize to recalculate
    window.addEventListener('resize', updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  /**
   * Clean up all timelines on unmount
   */
  useEffect(() => {
    return () => {
      timelinesRef.current.forEach((entry) => {
        entry.timeline.kill();
      });
      timelinesRef.current.clear();
    };
  }, []);

  const contextValue: AnimationContextValue = {
    scrollProgress,
    currentSection,
    isReducedMotion,
    registerAnimation,
    unregisterAnimation,
    setAnimationVisibility,
    setCurrentSection,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}

/**
 * Hook to consume animation context
 * @throws Error if used outside AnimationProvider
 */
export function useAnimationContext(): AnimationContextValue {
  const context = useContext(AnimationContext);
  
  if (context === undefined) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  
  return context;
}

/**
 * Hook to update current section (for use by section components)
 * @returns Function to set the current section
 */
export function useSetCurrentSection(): (section: string) => void {
  const context = useContext(AnimationContext);
  
  if (context === undefined) {
    throw new Error('useSetCurrentSection must be used within an AnimationProvider');
  }
  
  return context.setCurrentSection;
}

export { AnimationContext };
export default AnimationProvider;
