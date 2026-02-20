/**
 * Tests for useParallax hook
 * 
 * Tests parallax position calculation, speed multiplier configuration,
 * and layer management.
 * 
 * Requirements: 4.1, 4.2, 4.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import {
  calculateParallaxPosition,
  calculatePositionDelta,
  useParallax,
  type ParallaxLayerConfig,
} from './useParallax';
import { AnimationProvider } from '../context/AnimationContext';

// Mock window.matchMedia for reduced motion detection
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

beforeEach(() => {
  vi.stubGlobal('matchMedia', mockMatchMedia);
  vi.stubGlobal('innerHeight', 800);
  vi.stubGlobal('scrollY', 0);
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 2000,
    configurable: true,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('calculateParallaxPosition', () => {
  it('should return 0 when scroll progress is 0', () => {
    const position = calculateParallaxPosition(0, 1.0, 800);
    expect(position).toBe(0);
  });

  it('should return full range when scroll progress is 1', () => {
    const position = calculateParallaxPosition(1, 1.0, 800);
    expect(position).toBe(800);
  });

  it('should apply speed multiplier correctly', () => {
    const position = calculateParallaxPosition(1, 0.5, 800);
    expect(position).toBe(400);
  });

  it('should calculate proportional position for mid-scroll', () => {
    const position = calculateParallaxPosition(0.5, 1.0, 800);
    expect(position).toBe(400);
  });

  it('should handle speed multiplier greater than 1', () => {
    const position = calculateParallaxPosition(0.5, 2.0, 800);
    expect(position).toBe(800);
  });

  it('should handle very small speed multipliers', () => {
    const position = calculateParallaxPosition(1, 0.1, 800);
    expect(position).toBe(80);
  });

  describe('with bounds', () => {
    it('should return 0 when scroll progress is before bounds start', () => {
      const position = calculateParallaxPosition(0.1, 1.0, 800, { start: 0.3, end: 0.7 });
      expect(position).toBe(0);
    });

    it('should return full range when scroll progress is after bounds end', () => {
      const position = calculateParallaxPosition(0.9, 1.0, 800, { start: 0.3, end: 0.7 });
      expect(position).toBe(800);
    });

    it('should normalize progress within bounds', () => {
      const position = calculateParallaxPosition(0.5, 1.0, 800, { start: 0.3, end: 0.7 });
      expect(position).toBeCloseTo(400, 5);
    });

    it('should handle bounds at start of scroll', () => {
      const position = calculateParallaxPosition(0.3, 1.0, 800, { start: 0.3, end: 0.7 });
      expect(position).toBe(0);
    });

    it('should handle bounds at end of scroll', () => {
      const position = calculateParallaxPosition(0.7, 1.0, 800, { start: 0.3, end: 0.7 });
      expect(position).toBe(800);
    });
  });
});

describe('calculatePositionDelta', () => {
  it('should calculate delta as scroll delta times speed multiplier times base range', () => {
    const delta = calculatePositionDelta(0.1, 1.0, 800);
    expect(delta).toBe(80);
  });

  it('should apply speed multiplier to delta', () => {
    const delta = calculatePositionDelta(0.1, 2.0, 800);
    expect(delta).toBe(160);
  });

  it('should handle negative scroll delta', () => {
    const delta = calculatePositionDelta(-0.1, 1.0, 800);
    expect(delta).toBe(-80);
  });

  it('should return 0 for zero scroll delta', () => {
    const delta = calculatePositionDelta(0, 1.5, 800);
    expect(delta).toBe(0);
  });
});


describe('useParallax hook', () => {
  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      React.createElement(AnimationProvider, { children, initialSection: 'hero' })
    );
  };

  const defaultLayers: ParallaxLayerConfig[] = [
    { id: 'layer1', speedMultiplier: 0.5, direction: 'vertical' },
    { id: 'layer2', speedMultiplier: 1.0, direction: 'vertical' },
    { id: 'layer3', speedMultiplier: 1.5, direction: 'horizontal' },
  ];

  it('should initialize with layer states for all configured layers', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers }),
      { wrapper: createWrapper() }
    );
    expect(result.current.layerStates.size).toBe(3);
    expect(result.current.layerStates.has('layer1')).toBe(true);
    expect(result.current.layerStates.has('layer2')).toBe(true);
    expect(result.current.layerStates.has('layer3')).toBe(true);
  });

  it('should store correct speed multipliers for each layer', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers }),
      { wrapper: createWrapper() }
    );
    expect(result.current.layerStates.get('layer1')?.speedMultiplier).toBe(0.5);
    expect(result.current.layerStates.get('layer2')?.speedMultiplier).toBe(1.0);
    expect(result.current.layerStates.get('layer3')?.speedMultiplier).toBe(1.5);
  });

  it('should store correct direction for each layer', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers }),
      { wrapper: createWrapper() }
    );
    expect(result.current.layerStates.get('layer1')?.direction).toBe('vertical');
    expect(result.current.layerStates.get('layer2')?.direction).toBe('vertical');
    expect(result.current.layerStates.get('layer3')?.direction).toBe('horizontal');
  });

  it('should return 0 position for non-existent layer', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers }),
      { wrapper: createWrapper() }
    );
    expect(result.current.getLayerPosition('nonexistent')).toBe(0);
  });

  it('should return empty style for non-existent layer', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers }),
      { wrapper: createWrapper() }
    );
    expect(result.current.getLayerStyle('nonexistent')).toEqual({});
  });

  it('should use custom baseScrollRange when provided', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers, baseScrollRange: 1000 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.layerStates.size).toBe(3);
  });

  it('should return isDisabled as false by default', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers }),
      { wrapper: createWrapper() }
    );
    expect(result.current.isDisabled).toBe(false);
  });

  it('should return isDisabled as true when disabled option is true', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers, disabled: true }),
      { wrapper: createWrapper() }
    );
    expect(result.current.isDisabled).toBe(true);
  });

  it('should return positions of 0 when disabled', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers, disabled: true }),
      { wrapper: createWrapper() }
    );
    expect(result.current.getLayerPosition('layer1')).toBe(0);
    expect(result.current.getLayerPosition('layer2')).toBe(0);
    expect(result.current.getLayerPosition('layer3')).toBe(0);
  });

  it('should return empty styles when disabled', () => {
    const { result } = renderHook(
      () => useParallax({ layers: defaultLayers, disabled: true }),
      { wrapper: createWrapper() }
    );
    expect(result.current.getLayerStyle('layer1')).toEqual({});
    expect(result.current.getLayerStyle('layer2')).toEqual({});
    expect(result.current.getLayerStyle('layer3')).toEqual({});
  });


  describe('getLayerStyle', () => {
    it('should return vertical transform for vertical layers', () => {
      const layers: ParallaxLayerConfig[] = [
        { id: 'vertical', speedMultiplier: 1.0, direction: 'vertical' },
      ];
      const { result } = renderHook(
        () => useParallax({ layers }),
        { wrapper: createWrapper() }
      );
      const style = result.current.getLayerStyle('vertical');
      expect(style.transform).toMatch(/translateY\(/);
      expect(style.willChange).toBe('transform');
    });

    it('should return horizontal transform for horizontal layers', () => {
      const layers: ParallaxLayerConfig[] = [
        { id: 'horizontal', speedMultiplier: 1.0, direction: 'horizontal' },
      ];
      const { result } = renderHook(
        () => useParallax({ layers }),
        { wrapper: createWrapper() }
      );
      const style = result.current.getLayerStyle('horizontal');
      expect(style.transform).toMatch(/translateX\(/);
      expect(style.willChange).toBe('transform');
    });
  });

  describe('with reduced motion', () => {
    beforeEach(() => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    });

    it('should be disabled when reduced motion is preferred', () => {
      const { result } = renderHook(
        () => useParallax({ layers: defaultLayers }),
        { wrapper: createWrapper() }
      );
      expect(result.current.isDisabled).toBe(true);
    });

    it('should return 0 positions when reduced motion is preferred', () => {
      const { result } = renderHook(
        () => useParallax({ layers: defaultLayers }),
        { wrapper: createWrapper() }
      );
      expect(result.current.getLayerPosition('layer1')).toBe(0);
      expect(result.current.getLayerPosition('layer2')).toBe(0);
    });
  });

  describe('layer configuration updates', () => {
    it('should handle adding new layers', () => {
      const initialLayers: ParallaxLayerConfig[] = [
        { id: 'layer1', speedMultiplier: 0.5, direction: 'vertical' },
      ];
      const { result, rerender } = renderHook(
        ({ layers }) => useParallax({ layers }),
        { wrapper: createWrapper(), initialProps: { layers: initialLayers } }
      );
      expect(result.current.layerStates.size).toBe(1);
      const updatedLayers: ParallaxLayerConfig[] = [
        { id: 'layer1', speedMultiplier: 0.5, direction: 'vertical' },
        { id: 'layer2', speedMultiplier: 1.0, direction: 'horizontal' },
      ];
      rerender({ layers: updatedLayers });
      expect(result.current.layerStates.size).toBe(2);
      expect(result.current.layerStates.has('layer2')).toBe(true);
    });

    it('should handle updating layer speed multipliers', () => {
      const initialLayers: ParallaxLayerConfig[] = [
        { id: 'layer1', speedMultiplier: 0.5, direction: 'vertical' },
      ];
      const { result, rerender } = renderHook(
        ({ layers }) => useParallax({ layers }),
        { wrapper: createWrapper(), initialProps: { layers: initialLayers } }
      );
      expect(result.current.layerStates.get('layer1')?.speedMultiplier).toBe(0.5);
      const updatedLayers: ParallaxLayerConfig[] = [
        { id: 'layer1', speedMultiplier: 2.0, direction: 'vertical' },
      ];
      rerender({ layers: updatedLayers });
      expect(result.current.layerStates.get('layer1')?.speedMultiplier).toBe(2.0);
    });
  });
});
