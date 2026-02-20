/**
 * Scroll Controller Hook
 * 
 * Provides scroll-based navigation and section tracking functionality.
 * Builds on top of AnimationContext for scroll progress calculation.
 * 
 * Requirements: 3.4, 3.5, 13.4
 */

import { useEffect, useCallback, useRef } from 'react';
import { useAnimationContext } from '../context/AnimationContext';

/**
 * Configuration options for the scroll controller
 */
export interface UseScrollControllerOptions {
  /** Callback fired when scroll progress changes */
  onScrollProgress?: (progress: number) => void;
  /** Callback fired when current section changes */
  onSectionChange?: (section: string) => void;
  /** Throttle interval in milliseconds (default: 16ms for ~60fps) */
  throttleMs?: number;
  /** Section IDs to track (in order from top to bottom) */
  sectionIds?: string[];
}

/**
 * Return value from useScrollController hook
 */
export interface ScrollControllerReturn {
  /** Normalized scroll progress (0-1) */
  scrollProgress: number;
  /** Currently visible section identifier */
  currentSection: string;
  /** Smoothly scroll to a specific section */
  scrollToSection: (sectionId: string) => void;
  /** Check if a section is currently in viewport */
  isSectionInView: (sectionId: string) => boolean;
}

/**
 * Default section IDs for the portfolio
 */
const DEFAULT_SECTION_IDS = ['hero', 'education', 'experience', 'achievements', 'contact'];

/**
 * Determines which section occupies the majority of the viewport
 * @param sectionIds - Array of section IDs to check
 * @returns The section ID that occupies the most viewport space
 */
export function detectCurrentSection(sectionIds: string[]): string {
  if (typeof window === 'undefined') return sectionIds[0] || '';
  
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  
  let bestSection = sectionIds[0] || '';
  let bestScore = -Infinity;
  
  for (const sectionId of sectionIds) {
    const element = document.getElementById(sectionId);
    if (!element) continue;
    
    const rect = element.getBoundingClientRect();
    
    // Calculate how much of the section is visible in viewport
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    
    // Score based on visible area and proximity to viewport center
    const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - viewportCenter);
    const score = visibleHeight - centerDistance * 0.5;
    
    if (score > bestScore) {
      bestScore = score;
      bestSection = sectionId;
    }
  }
  
  return bestSection;
}

/**
 * Checks if a section element is currently visible in the viewport
 * @param sectionId - The section ID to check
 * @returns true if the section is at least partially visible
 */
export function isSectionVisible(sectionId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const element = document.getElementById(sectionId);
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // Section is visible if any part is within viewport
  return rect.bottom > 0 && rect.top < viewportHeight;
}

/**
 * Scroll Controller Hook
 * 
 * Provides comprehensive scroll management including:
 * - Throttled scroll progress tracking
 * - Current section detection based on viewport intersection
 * - Smooth scroll navigation to sections
 * 
 * @param options - Configuration options
 * @returns Scroll controller state and functions
 */
export function useScrollController(
  options: UseScrollControllerOptions = {}
): ScrollControllerReturn {
  const {
    onScrollProgress,
    onSectionChange,
    throttleMs = 16, // ~60fps
    sectionIds = DEFAULT_SECTION_IDS,
  } = options;

  // Get scroll progress from AnimationContext
  const { scrollProgress, currentSection, setCurrentSection } = useAnimationContext();
  
  // Track last throttle time for section detection
  const lastThrottleTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  /**
   * Smoothly scroll to a specific section
   * Uses native smooth scroll behavior for best performance
   */
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  /**
   * Check if a section is currently in viewport
   */
  const isSectionInView = useCallback((sectionId: string): boolean => {
    return isSectionVisible(sectionId);
  }, []);

  /**
   * Handle scroll progress changes
   */
  useEffect(() => {
    if (onScrollProgress) {
      onScrollProgress(scrollProgress);
    }
  }, [scrollProgress, onScrollProgress]);

  /**
   * Throttled section detection based on viewport intersection
   * Uses requestAnimationFrame for smooth 60fps updates (Req 13.4)
   */
  useEffect(() => {
    const updateCurrentSection = () => {
      const now = performance.now();
      
      // Throttle updates
      if (now - lastThrottleTimeRef.current < throttleMs) {
        rafIdRef.current = requestAnimationFrame(updateCurrentSection);
        return;
      }
      
      lastThrottleTimeRef.current = now;
      
      const detectedSection = detectCurrentSection(sectionIds);
      
      if (detectedSection !== currentSection) {
        setCurrentSection(detectedSection);
        
        if (onSectionChange) {
          onSectionChange(detectedSection);
        }
      }
      
      rafIdRef.current = null;
    };

    const handleScroll = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateCurrentSection);
      }
    };

    // Initial detection
    updateCurrentSection();

    // Listen for scroll events with passive flag for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also update on resize as section positions may change
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [sectionIds, currentSection, setCurrentSection, onSectionChange, throttleMs]);

  return {
    scrollProgress,
    currentSection,
    scrollToSection,
    isSectionInView,
  };
}

export default useScrollController;
