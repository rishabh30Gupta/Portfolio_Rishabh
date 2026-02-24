/**
 * ParallaxWrapper Component
 * 
 * A reusable component that wraps content and applies parallax behavior based on scroll.
 * Uses the useParallax hook for parallax calculations and applies GPU-accelerated transforms.
 * 
 * Supports:
 * - Vertical and horizontal parallax directions
 * - Configurable speed multipliers
 * - GPU-accelerated transforms (translateY/translateX)
 * 
 * Requirements: 4.2, 13.3
 */

import { useRef, useMemo, type ReactNode, type CSSProperties } from 'react';
import { useParallax, type ParallaxLayerConfig } from '../hooks/useParallax';

/**
 * Props for ParallaxWrapper component
 */
export interface ParallaxWrapperProps {
  /** Content to apply parallax effect to */
  children: ReactNode;
  /** Speed multiplier for parallax effect (0.1 = slow, 1 = normal, 2 = fast) */
  speed: number;
  /** Direction of parallax movement */
  direction?: 'vertical' | 'horizontal';
  /** Optional unique identifier (auto-generated if not provided) */
  id?: string;
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Optional bounds for the parallax effect (scroll progress range 0-1) */
  bounds?: { start: number; end: number };
  /** Base scroll range in pixels (default: viewport height) */
  baseScrollRange?: number;
}

/**
 * Generate a unique ID for parallax layers
 */
function generateId(): string {
  return `parallax-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ParallaxWrapper Component
 * 
 * Wraps content and applies parallax behavior using GPU-accelerated transforms.
 * The parallax effect is calculated based on scroll position and the configured speed multiplier.
 */
export function ParallaxWrapper({
  children,
  speed,
  direction = 'vertical',
  id,
  className = '',
  style = {},
  bounds,
  baseScrollRange,
}: ParallaxWrapperProps) {
  // Generate stable ID for this parallax layer
  const layerIdRef = useRef<string>(id || generateId());
  const layerId = layerIdRef.current;

  // Create layer configuration
  const layers = useMemo<ParallaxLayerConfig[]>(() => [{
    id: layerId,
    speedMultiplier: speed,
    direction,
    bounds,
  }], [layerId, speed, direction, bounds]);

  // Use parallax hook to get transform styles
  const { getLayerStyle, isDisabled } = useParallax({
    layers,
    baseScrollRange,
  });

  // Get the parallax transform style for this layer
  const parallaxStyle = getLayerStyle(layerId);

  // Combine parallax style with custom styles
  const combinedStyle: CSSProperties = {
    ...style,
    ...parallaxStyle,
    // Ensure will-change is set for GPU acceleration (Req 13.3)
    willChange: isDisabled ? undefined : 'transform',
  };

  return (
    <div
      className={`parallax-wrapper ${className}`.trim()}
      style={combinedStyle}
      data-parallax-id={layerId}
      data-parallax-speed={speed}
      data-parallax-direction={direction}
    >
      {children}
    </div>
  );
}

export default ParallaxWrapper;
