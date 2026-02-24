/**
 * Tests for Animation Context Provider
 * 
 * Tests the AnimationContext functionality including:
 * - Context provider rendering
 * - Scroll progress calculation
 * - Reduced motion detection
 * - Animation registration/unregistration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import {
  AnimationProvider,
  useAnimationContext,
  calculateScrollProgress,
} from './AnimationContext';

// Mock GSAP and ScrollTrigger
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
}));

describe('AnimationContext', () => {
  // Store original matchMedia
  const originalMatchMedia = window.matchMedia;
  
  beforeEach(() => {
    // Mock matchMedia for reduced motion detection
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.clearAllMocks();
  });

  describe('AnimationProvider', () => {
    it('renders children correctly', () => {
      render(
        <AnimationProvider>
          <div data-testid="child">Test Child</div>
        </AnimationProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('provides default context values', () => {
      const TestComponent = () => {
        const context = useAnimationContext();
        return (
          <div>
            <span data-testid="scroll-progress">{context.scrollProgress}</span>
            <span data-testid="current-section">{context.currentSection}</span>
            <span data-testid="reduced-motion">{String(context.isReducedMotion)}</span>
          </div>
        );
      };

      render(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('scroll-progress')).toHaveTextContent('0');
      expect(screen.getByTestId('current-section')).toHaveTextContent('hero');
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('false');
    });

    it('accepts custom initial section', () => {
      const TestComponent = () => {
        const context = useAnimationContext();
        return <span data-testid="section">{context.currentSection}</span>;
      };

      render(
        <AnimationProvider initialSection="education">
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('section')).toHaveTextContent('education');
    });
  });


  describe('useAnimationContext', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAnimationContext());
      }).toThrow('useAnimationContext must be used within an AnimationProvider');

      consoleSpy.mockRestore();
    });

    it('returns context value when used inside provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AnimationProvider>{children}</AnimationProvider>
      );

      const { result } = renderHook(() => useAnimationContext(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.scrollProgress).toBe('number');
      expect(typeof result.current.currentSection).toBe('string');
      expect(typeof result.current.isReducedMotion).toBe('boolean');
      expect(typeof result.current.registerAnimation).toBe('function');
      expect(typeof result.current.unregisterAnimation).toBe('function');
      expect(typeof result.current.setAnimationVisibility).toBe('function');
      expect(typeof result.current.setCurrentSection).toBe('function');
    });

    it('allows updating current section', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AnimationProvider>{children}</AnimationProvider>
      );

      const { result } = renderHook(() => useAnimationContext(), { wrapper });

      expect(result.current.currentSection).toBe('hero');

      act(() => {
        result.current.setCurrentSection('education');
      });

      expect(result.current.currentSection).toBe('education');
    });
  });

  describe('calculateScrollProgress', () => {
    it('returns 0 when at top of page', () => {
      const progress = calculateScrollProgress(0, 2000, 1000);
      expect(progress).toBe(0);
    });

    it('returns 1 when at bottom of page', () => {
      const progress = calculateScrollProgress(1000, 2000, 1000);
      expect(progress).toBe(1);
    });

    it('returns 0.5 when halfway through page', () => {
      const progress = calculateScrollProgress(500, 2000, 1000);
      expect(progress).toBe(0.5);
    });

    it('clamps negative scroll values to 0', () => {
      const progress = calculateScrollProgress(-100, 2000, 1000);
      expect(progress).toBe(0);
    });

    it('clamps values exceeding max scroll to 1', () => {
      const progress = calculateScrollProgress(1500, 2000, 1000);
      expect(progress).toBe(1);
    });

    it('returns 0 when document height equals viewport height', () => {
      const progress = calculateScrollProgress(0, 1000, 1000);
      expect(progress).toBe(0);
    });

    it('returns 0 when document height is less than viewport height', () => {
      const progress = calculateScrollProgress(0, 500, 1000);
      expect(progress).toBe(0);
    });

    it('handles fractional scroll positions correctly', () => {
      const progress = calculateScrollProgress(250, 2000, 1000);
      expect(progress).toBe(0.25);
    });
  });


  describe('Animation Registration', () => {
    it('registers and unregisters animations', () => {
      const mockTimeline = {
        pause: vi.fn(),
        resume: vi.fn(),
        kill: vi.fn(),
        paused: vi.fn().mockReturnValue(false),
      } as unknown as gsap.core.Timeline;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AnimationProvider>{children}</AnimationProvider>
      );

      const { result } = renderHook(() => useAnimationContext(), { wrapper });

      // Register animation
      act(() => {
        result.current.registerAnimation('test-animation', mockTimeline);
      });

      // Unregister animation
      act(() => {
        result.current.unregisterAnimation('test-animation');
      });

      expect(mockTimeline.kill).toHaveBeenCalled();
    });

    it('pauses animation when visibility is set to false', () => {
      const mockTimeline = {
        pause: vi.fn(),
        resume: vi.fn(),
        kill: vi.fn(),
        paused: vi.fn().mockReturnValue(false),
      } as unknown as gsap.core.Timeline;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AnimationProvider>{children}</AnimationProvider>
      );

      const { result } = renderHook(() => useAnimationContext(), { wrapper });

      // Register animation
      act(() => {
        result.current.registerAnimation('test-animation', mockTimeline);
      });

      // Set visibility to false
      act(() => {
        result.current.setAnimationVisibility('test-animation', false);
      });

      expect(mockTimeline.pause).toHaveBeenCalled();
    });

    it('resumes animation when visibility is set to true', () => {
      const mockTimeline = {
        pause: vi.fn(),
        resume: vi.fn(),
        kill: vi.fn(),
        paused: vi.fn().mockReturnValue(true),
      } as unknown as gsap.core.Timeline;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AnimationProvider>{children}</AnimationProvider>
      );

      const { result } = renderHook(() => useAnimationContext(), { wrapper });

      // Register animation
      act(() => {
        result.current.registerAnimation('test-animation', mockTimeline);
      });

      // Set visibility to true
      act(() => {
        result.current.setAnimationVisibility('test-animation', true);
      });

      expect(mockTimeline.resume).toHaveBeenCalled();
    });
  });

  describe('Reduced Motion', () => {
    it('detects reduced motion preference', () => {
      // Mock reduced motion preference as true
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AnimationProvider>{children}</AnimationProvider>
      );

      const { result } = renderHook(() => useAnimationContext(), { wrapper });

      expect(result.current.isReducedMotion).toBe(true);
    });

    it('pauses animations when reduced motion is enabled', () => {
      // Mock reduced motion preference as true
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const mockTimeline = {
        pause: vi.fn(),
        resume: vi.fn(),
        kill: vi.fn(),
        paused: vi.fn().mockReturnValue(false),
      } as unknown as gsap.core.Timeline;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AnimationProvider>{children}</AnimationProvider>
      );

      const { result } = renderHook(() => useAnimationContext(), { wrapper });

      // Register animation - should be paused immediately due to reduced motion
      act(() => {
        result.current.registerAnimation('test-animation', mockTimeline);
      });

      expect(mockTimeline.pause).toHaveBeenCalled();
    });
  });
});
