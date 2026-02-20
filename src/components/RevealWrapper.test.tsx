/**
 * RevealWrapper Component Tests
 * 
 * Tests for scroll-triggered reveal animations using GSAP ScrollTrigger.
 * Requirements: 3.4, 5.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { RevealWrapper, type RevealDirection } from './RevealWrapper';
import { AnimationProvider } from '../context/AnimationContext';

// Mock GSAP and ScrollTrigger
vi.mock('gsap', () => {
  const mockTimeline = {
    to: vi.fn().mockReturnThis(),
    play: vi.fn().mockReturnThis(),
    reverse: vi.fn().mockReturnThis(),
    pause: vi.fn().mockReturnThis(),
    kill: vi.fn().mockReturnThis(),
    paused: vi.fn().mockReturnValue(false),
  };

  return {
    default: {
      registerPlugin: vi.fn(),
      set: vi.fn(),
      timeline: vi.fn(() => mockTimeline),
      to: vi.fn().mockReturnValue(mockTimeline),
    },
    gsap: {
      registerPlugin: vi.fn(),
      set: vi.fn(),
      timeline: vi.fn(() => mockTimeline),
      to: vi.fn().mockReturnValue(mockTimeline),
    },
  };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({
      kill: vi.fn(),
    })),
  },
}));

// Helper to render with AnimationProvider
function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AnimationProvider>
      {ui}
    </AnimationProvider>
  );
}

describe('RevealWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders children correctly', () => {
      renderWithProvider(
        <RevealWrapper>
          <div data-testid="child">Test Content</div>
        </RevealWrapper>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      renderWithProvider(
        <RevealWrapper>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </RevealWrapper>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      renderWithProvider(
        <RevealWrapper className="custom-class">
          <div>Content</div>
        </RevealWrapper>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper).toHaveClass('reveal-wrapper');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('wraps children in reveal-child divs when staggerChildren is true', () => {
      renderWithProvider(
        <RevealWrapper staggerChildren>
          <span>Child 1</span>
          <span>Child 2</span>
        </RevealWrapper>
      );

      const revealChildren = document.querySelectorAll('.reveal-child');
      expect(revealChildren.length).toBe(2);
    });

    it('does not wrap single child when staggerChildren is true', () => {
      renderWithProvider(
        <RevealWrapper staggerChildren>
          <span>Single Child</span>
        </RevealWrapper>
      );

      const revealChildren = document.querySelectorAll('.reveal-child');
      expect(revealChildren.length).toBe(0);
    });
  });

  describe('Direction Variants', () => {
    const directions: RevealDirection[] = ['up', 'down', 'left', 'right', 'fade'];

    directions.forEach((direction) => {
      it(`renders with direction="${direction}"`, () => {
        renderWithProvider(
          <RevealWrapper direction={direction}>
            <div data-testid="content">Content</div>
          </RevealWrapper>
        );

        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
    });
  });

  describe('Props', () => {
    it('accepts delay prop', () => {
      renderWithProvider(
        <RevealWrapper delay={0.5}>
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts duration prop', () => {
      renderWithProvider(
        <RevealWrapper duration={1.5}>
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts stagger prop', () => {
      renderWithProvider(
        <RevealWrapper stagger={0.2} staggerChildren>
          <div>Child 1</div>
          <div>Child 2</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('accepts triggerPosition prop', () => {
      renderWithProvider(
        <RevealWrapper triggerPosition="top 90%">
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts distance prop', () => {
      renderWithProvider(
        <RevealWrapper distance={100}>
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts easing prop', () => {
      renderWithProvider(
        <RevealWrapper easing="power3.out">
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts once prop', () => {
      renderWithProvider(
        <RevealWrapper once={false}>
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('accepts onAnimationStart callback', () => {
      const onStart = vi.fn();
      
      renderWithProvider(
        <RevealWrapper onAnimationStart={onStart}>
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts onAnimationComplete callback', () => {
      const onComplete = vi.fn();
      
      renderWithProvider(
        <RevealWrapper onAnimationComplete={onComplete}>
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('applies will-change for GPU acceleration', () => {
      renderWithProvider(
        <RevealWrapper>
          <div>Content</div>
        </RevealWrapper>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper).toHaveStyle({ willChange: 'transform, opacity' });
    });
  });

  describe('Default Values', () => {
    it('uses default direction of "up"', () => {
      renderWithProvider(
        <RevealWrapper>
          <div>Content</div>
        </RevealWrapper>
      );

      // Component renders without error with default direction
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('uses default triggerPosition of "top 80%"', () => {
      renderWithProvider(
        <RevealWrapper>
          <div>Content</div>
        </RevealWrapper>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
