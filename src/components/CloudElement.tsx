/**
 * CloudElement Component
 * 
 * A decorative cloud-shaped SVG element that animates based on scroll position.
 * 
 * Features:
 * - Cloud-shaped SVG decorative elements
 * - Multiple sizes and variants
 * - Position animation based on scroll progress
 * 
 * Requirements: 5.1, 5.5
 */

import { useMemo } from 'react';
import './CloudElement.css';

/**
 * Cloud size options
 */
export type CloudSize = 'small' | 'medium' | 'large';

/**
 * Props for CloudElement component
 */
export interface CloudElementProps {
  /** Size of the cloud */
  size?: CloudSize;
  /** Variant number for different cloud shapes (1-3) */
  variant?: 1 | 2 | 3;
  /** Opacity of the cloud (0-1) */
  opacity?: number;
  /** Scroll progress (0-1) for position calculation */
  scrollProgress?: number;
  /** Start position */
  startPosition?: { x: number; y: number };
  /** End position */
  endPosition?: { x: number; y: number };
  /** Scroll progress to start animation (0-1) */
  triggerStart?: number;
  /** Scroll progress to end animation (0-1) */
  triggerEnd?: number;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Get size dimensions
 */
function getSizeDimensions(size: CloudSize): { width: number; height: number } {
  switch (size) {
    case 'small':
      return { width: 80, height: 50 };
    case 'medium':
      return { width: 120, height: 75 };
    case 'large':
      return { width: 180, height: 110 };
    default:
      return { width: 120, height: 75 };
  }
}

/**
 * Cloud SVG paths for different variants
 */
const cloudPaths: Record<number, string> = {
  1: 'M25 60 Q10 60 10 45 Q10 30 25 30 Q25 15 45 15 Q65 15 70 30 Q90 25 95 40 Q100 55 85 60 Z',
  2: 'M20 55 Q5 55 8 40 Q10 25 30 25 Q35 10 55 12 Q75 14 80 30 Q95 28 98 42 Q100 58 80 58 Z',
  3: 'M15 58 Q0 55 5 40 Q8 25 25 28 Q30 12 50 10 Q70 8 78 25 Q95 22 100 40 Q102 58 85 60 Z',
};

/**
 * Calculate interpolated position based on scroll progress
 */
export function calculatePosition(
  scrollProgress: number,
  startPosition: { x: number; y: number },
  endPosition: { x: number; y: number },
  triggerStart: number,
  triggerEnd: number
): { x: number; y: number } {
  // Clamp scroll progress to trigger range
  if (scrollProgress <= triggerStart) {
    return startPosition;
  }
  if (scrollProgress >= triggerEnd) {
    return endPosition;
  }

  // Calculate progress within trigger range
  const rangeProgress = (scrollProgress - triggerStart) / (triggerEnd - triggerStart);
  
  // Interpolate position
  return {
    x: startPosition.x + (endPosition.x - startPosition.x) * rangeProgress,
    y: startPosition.y + (endPosition.y - startPosition.y) * rangeProgress,
  };
}

/**
 * CloudElement Component
 */
export function CloudElement({
  size = 'medium',
  variant = 1,
  opacity = 0.6,
  scrollProgress = 0,
  startPosition = { x: 0, y: 0 },
  endPosition = { x: 0, y: 0 },
  triggerStart = 0,
  triggerEnd = 1,
  className = '',
}: CloudElementProps) {
  const dimensions = getSizeDimensions(size);
  const path = cloudPaths[variant] || cloudPaths[1];

  const position = useMemo(
    () => calculatePosition(scrollProgress, startPosition, endPosition, triggerStart, triggerEnd),
    [scrollProgress, startPosition, endPosition, triggerStart, triggerEnd]
  );

  return (
    <div
      className={`cloud-element cloud-element--${size} ${className}`.trim()}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity,
        width: dimensions.width,
        height: dimensions.height,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 70"
        fill="currentColor"
        className="cloud-element-svg"
      >
        <path d={path} />
      </svg>
    </div>
  );
}

export default CloudElement;
