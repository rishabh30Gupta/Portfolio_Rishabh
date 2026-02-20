/**
 * Parallax Engine Hook
 * 
 * Provides parallax layer management with configurable speed multipliers.
 * Calculates position updates based on scroll delta and speed multiplier.
 * 
 * Requirements: 4.1, 4.2, 4.5
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAnimationContext } from '../context/AnimationContext';

/**
 * Configuration for a single parallax layer
 */
export interface ParallaxLayerConfig {
  /** Unique identifier for the layer */
  id: string;
  /** Speed multiplier: 0.1 = slow, 1 = normal, 2 = fast */
  speedMultiplier: number;
  /** Direction of parallax movement */
  direction: 'vertical' | 'horizontal';
  /** Optional bounds for the parallax effect (scroll progress range) */
  bounds?: { start: number; end: number };
}

/**
 * State for a single parallax layer
 */
export interface ParallaxLayerState {
  /** Layer identifier */
  id: string;
  /** Current position offset (in pixels) */
  position: number;
  /** Speed multiplier for this layer */
  speedMultiplier: number;
  /** Direction of movement */
  direction: 'vertical' | 'horizontal';
}

/**
 * Options for the useParallax hook
 */
export interface UseParallaxOptions {
  /** Array of layer configurations */
  layers: ParallaxLayerConfig[];
  /** Base scroll range in pixels (default: viewport height) */
  baseScrollRange?: number;
  /** Whether to disable parallax (e.g., for reduced motion) */
  disabled?: boolean;
}

/**
 * Return value from useParallax hook
 */
export interface UseParallaxReturn {
  /** Current state of all parallax layers */
  layerStates: Map<string, ParallaxLayerState>;
  /** Get position for a specific layer */
  getLayerPosition: (layerId: string) => number;
  /** Get transform style for a specific layer */
  getLayerStyle: (layerId: string) => React.CSSProperties;
  /** Current scroll progress (0-1) */
  scrollProgress: number;
  /** Whether parallax is currently disabled */
  isDisabled: boolean;
}

/**
 * Calculates parallax position based on scroll progress and speed multiplier
 * 
 * Property 7: Position change = scroll delta × speed multiplier
 * Property 8: Layers respect configured speed multipliers
 * 
 * @param scrollProgress - Normalized scroll progress (0-1)
 * @param speedMultiplier - Speed multiplier for the layer
 * @param baseRange - Base scroll range in pixels
 * @param bounds - Optional bounds for the effect
 * @returns Position offset in pixels
 */
export function calculateParallaxPosition(
  scrollProgress: number,
  speedMultiplier: number,
  baseRange: number,
  bounds?: { start: number; end: number }
): number {
  // Apply bounds if specified
  let effectiveProgress = scrollProgress;
  
  if (bounds) {
    const { start, end } = bounds;
    if (scrollProgress < start) {
      effectiveProgress = 0;
    } else if (scrollProgress > end) {
      effectiveProgress = 1;
    } else {
      // Normalize progress within bounds
      effectiveProgress = (scrollProgress - start) / (end - start);
    }
  }
  
  // Property 7: Position = scroll delta × speed multiplier
  // The position is calculated as the scroll progress times the base range times the speed multiplier
  // This creates the parallax effect where different layers move at different speeds
  return effectiveProgress * baseRange * speedMultiplier;
}

/**
 * Calculates the position delta between two scroll positions
 * 
 * Property 7: For any parallax layer with speed multiplier `s` and scroll delta `d`,
 * the layer's position change SHALL equal `d * s`
 * 
 * @param scrollDelta - Change in scroll progress
 * @param speedMultiplier - Speed multiplier for the layer
 * @param baseRange - Base scroll range in pixels
 * @returns Position delta in pixels
 */
export function calculatePositionDelta(
  scrollDelta: number,
  speedMultiplier: number,
  baseRange: number
): number {
  return scrollDelta * baseRange * speedMultiplier;
}

/**
 * Parallax Engine Hook
 * 
 * Manages multiple parallax layers with configurable speed multipliers.
 * Calculates position updates based on scroll progress from AnimationContext.
 * 
 * @param options - Configuration options for parallax layers
 * @returns Parallax state and utility functions
 */
export function useParallax(options: UseParallaxOptions): UseParallaxReturn {
  const { layers, baseScrollRange, disabled = false } = options;
  
  // Get scroll progress from AnimationContext
  const { scrollProgress, isReducedMotion } = useAnimationContext();
  
  // Determine if parallax should be disabled
  const isDisabled = disabled || isReducedMotion;
  
  // Track previous scroll progress for delta calculations
  const prevScrollProgressRef = useRef(scrollProgress);
  
  // Calculate base range (default to viewport height)
  const baseRange = useMemo(() => {
    if (baseScrollRange !== undefined) return baseScrollRange;
    if (typeof window !== 'undefined') return window.innerHeight;
    return 800; // Fallback for SSR
  }, [baseScrollRange]);
  
  // Initialize layer states
  const [layerStates, setLayerStates] = useState<Map<string, ParallaxLayerState>>(() => {
    const initialStates = new Map<string, ParallaxLayerState>();
    
    for (const layer of layers) {
      const position = isDisabled
        ? 0
        : calculateParallaxPosition(scrollProgress, layer.speedMultiplier, baseRange, layer.bounds);
      
      initialStates.set(layer.id, {
        id: layer.id,
        position,
        speedMultiplier: layer.speedMultiplier,
        direction: layer.direction,
      });
    }
    
    return initialStates;
  });
  
  // Update layer positions when scroll progress changes
  useEffect(() => {
    if (isDisabled) {
      // Reset all positions to 0 when disabled
      setLayerStates(prev => {
        const newStates = new Map<string, ParallaxLayerState>();
        prev.forEach((state, id) => {
          newStates.set(id, { ...state, position: 0 });
        });
        return newStates;
      });
      return;
    }
    
    // Calculate new positions for all layers
    setLayerStates(() => {
      const newStates = new Map<string, ParallaxLayerState>();
      
      for (const layer of layers) {
        const position = calculateParallaxPosition(
          scrollProgress,
          layer.speedMultiplier,
          baseRange,
          layer.bounds
        );
        
        newStates.set(layer.id, {
          id: layer.id,
          position,
          speedMultiplier: layer.speedMultiplier,
          direction: layer.direction,
        });
      }
      
      return newStates;
    });
    
    prevScrollProgressRef.current = scrollProgress;
  }, [scrollProgress, layers, baseRange, isDisabled]);
  
  // Update layer configurations when they change
  useEffect(() => {
    setLayerStates(() => {
      const newStates = new Map<string, ParallaxLayerState>();
      
      for (const layer of layers) {
        const position = isDisabled
          ? 0
          : calculateParallaxPosition(scrollProgress, layer.speedMultiplier, baseRange, layer.bounds);
        
        newStates.set(layer.id, {
          id: layer.id,
          position,
          speedMultiplier: layer.speedMultiplier,
          direction: layer.direction,
        });
      }
      
      return newStates;
    });
  }, [layers, baseRange, isDisabled, scrollProgress]);
  
  /**
   * Get position for a specific layer
   */
  const getLayerPosition = useCallback((layerId: string): number => {
    const state = layerStates.get(layerId);
    return state?.position ?? 0;
  }, [layerStates]);
  
  /**
   * Get transform style for a specific layer
   * Uses GPU-accelerated transform properties (Req 13.3)
   */
  const getLayerStyle = useCallback((layerId: string): React.CSSProperties => {
    const state = layerStates.get(layerId);
    
    if (!state || isDisabled) {
      return {};
    }
    
    const { position, direction } = state;
    
    // Use transform for GPU acceleration (Req 13.3)
    const transform = direction === 'vertical'
      ? `translateY(${position}px)`
      : `translateX(${position}px)`;
    
    return {
      transform,
      willChange: 'transform',
    };
  }, [layerStates, isDisabled]);
  
  return {
    layerStates,
    getLayerPosition,
    getLayerStyle,
    scrollProgress,
    isDisabled,
  };
}

export default useParallax;
