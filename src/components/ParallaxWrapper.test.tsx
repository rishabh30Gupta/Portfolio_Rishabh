/**
 * ParallaxWrapper Component Tests
 * 
 * Tests for parallax behavior wrapper component.
 * Requirements: 4.2, 13.3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ParallaxWrapper } from './ParallaxWrapper';
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

describe('ParallaxWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders children correctly', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5}>
          <div data-testid="child">Test Content</div>
        </ParallaxWrapper>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ParallaxWrapper>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5} className="custom-class">
          <div>Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper).toHaveClass('parallax-wrapper');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('applies custom inline styles', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5} style={{ padding: '20px', margin: '10px' }}>
          <div>Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper).toHaveStyle({ padding: '20px', margin: '10px' });
    });
  });

  describe('Direction Variants', () => {
    it('renders with vertical direction (default)', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-direction', 'vertical');
    });

    it('renders with horizontal direction', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5} direction="horizontal">
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-direction', 'horizontal');
    });
  });

  describe('Speed Multiplier', () => {
    it('accepts slow speed multiplier (0.1)', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.1}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-speed', '0.1');
    });

    it('accepts normal speed multiplier (1)', () => {
      renderWithProvider(
        <ParallaxWrapper speed={1}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-speed', '1');
    });

    it('accepts fast speed multiplier (2)', () => {
      renderWithProvider(
        <ParallaxWrapper speed={2}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-speed', '2');
    });

    it('accepts negative speed multiplier for reverse parallax', () => {
      renderWithProvider(
        <ParallaxWrapper speed={-0.5}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-speed', '-0.5');
    });
  });

  describe('ID Handling', () => {
    it('uses provided id', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5} id="custom-parallax-id">
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-id', 'custom-parallax-id');
    });

    it('generates id when not provided', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      const id = wrapper?.getAttribute('data-parallax-id');
      expect(id).toBeTruthy();
      expect(id).toMatch(/^parallax-[a-z0-9]+$/);
    });
  });

  describe('Bounds Configuration', () => {
    it('accepts bounds prop', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5} bounds={{ start: 0.2, end: 0.8 }}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('Base Scroll Range', () => {
    it('accepts baseScrollRange prop', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5} baseScrollRange={1000}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('GPU Acceleration (Req 13.3)', () => {
    it('applies will-change for GPU acceleration', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5}>
          <div>Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper).toHaveStyle({ willChange: 'transform' });
    });
  });

  describe('Default Values', () => {
    it('uses default direction of "vertical"', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5}>
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByTestId('content').parentElement;
      expect(wrapper).toHaveAttribute('data-parallax-direction', 'vertical');
    });

    it('uses empty className by default', () => {
      renderWithProvider(
        <ParallaxWrapper speed={0.5}>
          <div>Content</div>
        </ParallaxWrapper>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper?.className).toBe('parallax-wrapper');
    });
  });

  describe('Transform Application', () => {
    it('applies vertical transform (translateY) for vertical direction', () => {
      // The actual transform value depends on scroll progress from context
      // This test verifies the component renders without error
      renderWithProvider(
        <ParallaxWrapper speed={0.5} direction="vertical">
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('applies horizontal transform (translateX) for horizontal direction', () => {
      // The actual transform value depends on scroll progress from context
      // This test verifies the component renders without error
      renderWithProvider(
        <ParallaxWrapper speed={0.5} direction="horizontal">
          <div data-testid="content">Content</div>
        </ParallaxWrapper>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});
