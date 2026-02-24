/**
 * PathAnimation Component
 * 
 * An SVG path that connects sections visually with scroll-based drawing animation.
 * 
 * Features:
 * - SVG path that connects sections visually
 * - Path drawing animation based on scroll progress
 * - Optional element that follows the path
 * 
 * Requirements: 5.2
 */

import { useMemo, type ReactNode } from 'react';
import './PathAnimation.css';

/**
 * Props for PathAnimation component
 */
export interface PathAnimationProps {
  /** SVG path data */
  pathData: string;
  /** Scroll progress (0-1) for animation */
  scrollProgress: number;
  /** Stroke color */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Optional element that follows the path */
  animatedElement?: ReactNode;
  /** SVG viewBox dimensions */
  viewBox?: string;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Calculate the point on a path at a given progress
 * This is a simplified calculation - for complex paths, use SVG's getPointAtLength
 */
export function getPathProgress(progress: number): number {
  // Clamp progress between 0 and 1
  return Math.max(0, Math.min(1, progress));
}

/**
 * PathAnimation Component
 */
export function PathAnimation({
  pathData,
  scrollProgress,
  strokeColor = 'var(--color-primary)',
  strokeWidth = 3,
  animatedElement,
  viewBox = '0 0 100 1000',
  className = '',
}: PathAnimationProps) {
  // Calculate dash offset based on scroll progress
  const pathLength = 2000; // Approximate path length
  const dashOffset = useMemo(() => {
    const progress = getPathProgress(scrollProgress);
    return pathLength * (1 - progress);
  }, [scrollProgress]);

  return (
    <div className={`path-animation ${className}`.trim()} aria-hidden="true">
      <svg
        viewBox={viewBox}
        className="path-animation-svg"
        preserveAspectRatio="none"
      >
        {/* Background path (faded) */}
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={0.1}
          className="path-animation-background"
        />
        
        {/* Animated path */}
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          className="path-animation-line"
        />
      </svg>

      {/* Animated element following the path */}
      {animatedElement && (
        <div
          className="path-animation-element"
          style={{
            '--progress': scrollProgress,
          } as React.CSSProperties}
        >
          {animatedElement}
        </div>
      )}
    </div>
  );
}

export default PathAnimation;
