/**
 * AchievementCard Component Tests
 * 
 * Tests for the AchievementCard component including:
 * - Rendering of title, description, and optional icon/date
 * - Stagger delay calculation
 * - CSS class application
 * - Semantic structure
 * 
 * Requirements: 9.1, 9.2, 9.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AchievementCard, type AchievementCardProps, calculateStaggerDelay } from './AchievementCard';

// Mock the AnimationContext
vi.mock('../context/AnimationContext', () => ({
  useAnimationContext: () => ({
    scrollProgress: 0,
    currentSection: 'achievements',
    isReducedMotion: true, // Disable animations for testing
    registerAnimation: vi.fn(),
    unregisterAnimation: vi.fn(),
  }),
}));

// Mock GSAP and ScrollTrigger
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      play: vi.fn(),
      reverse: vi.fn(),
      kill: vi.fn(),
    })),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
  },
}));

describe('AchievementCard', () => {
  const defaultProps: AchievementCardProps = {
    title: 'Best Developer Award',
    description: 'Recognized for outstanding contributions to the team.',
    index: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the title correctly', () => {
      render(<AchievementCard {...defaultProps} />);
      
      expect(screen.getByText('Best Developer Award')).toBeInTheDocument();
    });

    it('renders the description correctly', () => {
      render(<AchievementCard {...defaultProps} />);
      
      expect(screen.getByText('Recognized for outstanding contributions to the team.')).toBeInTheDocument();
    });

    it('renders all required fields together', () => {
      render(<AchievementCard {...defaultProps} />);
      
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });

    it('applies the correct CSS class', () => {
      const { container } = render(<AchievementCard {...defaultProps} />);
      
      expect(container.querySelector('.achievement-card')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <AchievementCard {...defaultProps} className="custom-class" />
      );
      
      const card = container.querySelector('.achievement-card');
      expect(card).toHaveClass('custom-class');
    });

    it('sets data-index attribute correctly', () => {
      const { container } = render(<AchievementCard {...defaultProps} index={3} />);
      
      const card = container.querySelector('.achievement-card');
      expect(card).toHaveAttribute('data-index', '3');
    });
  });

  describe('Optional Icon', () => {
    it('does not render icon section when no icon is provided', () => {
      const { container } = render(<AchievementCard {...defaultProps} />);
      
      expect(container.querySelector('.achievement-card-icon')).not.toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      const customIcon = <span data-testid="custom-icon">🏆</span>;
      render(<AchievementCard {...defaultProps} icon={customIcon} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('icon container has aria-hidden attribute', () => {
      const customIcon = <span>🏆</span>;
      const { container } = render(<AchievementCard {...defaultProps} icon={customIcon} />);
      
      const iconContainer = container.querySelector('.achievement-card-icon');
      expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Optional Date', () => {
    it('does not render date when not provided', () => {
      const { container } = render(<AchievementCard {...defaultProps} />);
      
      expect(container.querySelector('.achievement-card-date')).not.toBeInTheDocument();
    });

    it('renders date when provided', () => {
      render(<AchievementCard {...defaultProps} date="2024" />);
      
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('handles various date formats', () => {
      const dateFormats = [
        '2024',
        'January 2024',
        '2023 - 2024',
        'Q1 2024',
      ];

      dateFormats.forEach(date => {
        const { unmount } = render(<AchievementCard {...defaultProps} date={date} />);
        expect(screen.getByText(date)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('calculateStaggerDelay', () => {
    it('returns 0 for index 0', () => {
      expect(calculateStaggerDelay(0)).toBe(0);
    });

    it('returns correct delay for index 1 with default base delay', () => {
      expect(calculateStaggerDelay(1)).toBe(0.1);
    });

    it('returns correct delay for index 2 with default base delay', () => {
      expect(calculateStaggerDelay(2)).toBe(0.2);
    });

    it('uses custom base delay when provided', () => {
      expect(calculateStaggerDelay(2, 0.15)).toBe(0.3);
    });

    it('calculates delay proportionally to index', () => {
      const baseDelay = 0.1;
      for (let i = 0; i < 5; i++) {
        expect(calculateStaggerDelay(i, baseDelay)).toBe(i * baseDelay);
      }
    });
  });

  describe('Semantic Structure', () => {
    it('renders as an article element', () => {
      render(<AchievementCard {...defaultProps} />);
      
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('renders title as h3 element', () => {
      render(<AchievementCard {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent(defaultProps.title);
    });

    it('renders description as paragraph element', () => {
      const { container } = render(<AchievementCard {...defaultProps} />);
      
      const description = container.querySelector('.achievement-card-description');
      expect(description?.tagName).toBe('P');
    });
  });

  describe('Different Content Variations', () => {
    it('handles long title text', () => {
      const longTitle = 'Outstanding Achievement in Software Development and Innovation Excellence Award';
      render(<AchievementCard {...defaultProps} title={longTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles long description text', () => {
      const longDescription = 'This is a very long description that explains the achievement in great detail. It includes information about what was accomplished, the impact it had, and why it was significant to the organization and the broader community.';
      
      render(<AchievementCard {...defaultProps} description={longDescription} />);
      
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('renders with all optional props', () => {
      const fullProps: AchievementCardProps = {
        title: 'Full Achievement',
        description: 'Complete description',
        icon: <span data-testid="full-icon">🎖️</span>,
        date: 'December 2024',
        index: 2,
        className: 'featured-achievement',
      };

      const { container } = render(<AchievementCard {...fullProps} />);

      expect(screen.getByText(fullProps.title)).toBeInTheDocument();
      expect(screen.getByText(fullProps.description)).toBeInTheDocument();
      expect(screen.getByTestId('full-icon')).toBeInTheDocument();
      expect(screen.getByText('December 2024')).toBeInTheDocument();
      expect(container.querySelector('.achievement-card')).toHaveClass('featured-achievement');
      expect(container.querySelector('.achievement-card')).toHaveAttribute('data-index', '2');
    });
  });

  describe('RevealWrapper Integration', () => {
    it('wraps content in reveal-wrapper', () => {
      const { container } = render(<AchievementCard {...defaultProps} />);
      
      expect(container.querySelector('.reveal-wrapper')).toBeInTheDocument();
    });

    it('achievement card is inside reveal wrapper', () => {
      const { container } = render(<AchievementCard {...defaultProps} />);
      
      const revealWrapper = container.querySelector('.reveal-wrapper');
      const achievementCard = container.querySelector('.achievement-card') as HTMLElement | null;
      
      expect(revealWrapper).toContainElement(achievementCard);
    });
  });
});
