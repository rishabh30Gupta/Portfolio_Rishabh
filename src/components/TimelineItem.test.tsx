/**
 * TimelineItem Component Tests
 * 
 * Tests for the TimelineItem component including:
 * - Rendering of all required fields (title, organization, date, description)
 * - Stagger delay calculation
 * - Optional highlights rendering
 * - Custom icon support
 * 
 * Requirements: 7.1, 7.2, 7.4, 8.1, 8.2, 8.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimelineItem, type TimelineItemProps, calculateStaggerDelay } from './TimelineItem';

// Mock the AnimationContext
vi.mock('../context/AnimationContext', () => ({
  useAnimationContext: () => ({
    scrollProgress: 0,
    currentSection: 'education',
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

describe('TimelineItem', () => {
  const defaultProps: TimelineItemProps = {
    title: 'Software Engineer',
    organization: 'Tech Company Inc.',
    date: '2020 - 2024',
    description: 'Developed web applications using React and TypeScript.',
    index: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the title correctly', () => {
      render(<TimelineItem {...defaultProps} />);
      
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('renders the organization correctly', () => {
      render(<TimelineItem {...defaultProps} />);
      
      expect(screen.getByText('Tech Company Inc.')).toBeInTheDocument();
    });

    it('renders the date correctly', () => {
      render(<TimelineItem {...defaultProps} />);
      
      expect(screen.getByText('2020 - 2024')).toBeInTheDocument();
    });

    it('renders the description correctly', () => {
      render(<TimelineItem {...defaultProps} />);
      
      expect(screen.getByText('Developed web applications using React and TypeScript.')).toBeInTheDocument();
    });

    it('renders all required fields together', () => {
      render(<TimelineItem {...defaultProps} />);
      
      // All fields should be present
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.organization)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.date)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });

    it('applies the correct CSS class', () => {
      const { container } = render(<TimelineItem {...defaultProps} />);
      
      expect(container.querySelector('.timeline-item')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <TimelineItem {...defaultProps} className="custom-class" />
      );
      
      const item = container.querySelector('.timeline-item');
      expect(item).toHaveClass('custom-class');
    });

    it('sets data-index attribute correctly', () => {
      const { container } = render(<TimelineItem {...defaultProps} index={3} />);
      
      const item = container.querySelector('.timeline-item');
      expect(item).toHaveAttribute('data-index', '3');
    });
  });

  describe('Timeline Marker', () => {
    it('renders the default marker dot when no icon is provided', () => {
      const { container } = render(<TimelineItem {...defaultProps} />);
      
      expect(container.querySelector('.timeline-marker-dot')).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      const customIcon = <span data-testid="custom-icon">🎓</span>;
      render(<TimelineItem {...defaultProps} icon={customIcon} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('does not render marker dot when icon is provided', () => {
      const customIcon = <span>🎓</span>;
      const { container } = render(<TimelineItem {...defaultProps} icon={customIcon} />);
      
      expect(container.querySelector('.timeline-marker-dot')).not.toBeInTheDocument();
    });

    it('marker has aria-hidden attribute', () => {
      const { container } = render(<TimelineItem {...defaultProps} />);
      
      const marker = container.querySelector('.timeline-marker');
      expect(marker).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Highlights', () => {
    it('does not render highlights section when not provided', () => {
      const { container } = render(<TimelineItem {...defaultProps} />);
      
      expect(container.querySelector('.timeline-highlights')).not.toBeInTheDocument();
    });

    it('does not render highlights section when empty array is provided', () => {
      const { container } = render(
        <TimelineItem {...defaultProps} highlights={[]} />
      );
      
      expect(container.querySelector('.timeline-highlights')).not.toBeInTheDocument();
    });

    it('renders highlights when provided', () => {
      const highlights = [
        'Led a team of 5 developers',
        'Improved performance by 40%',
        'Implemented CI/CD pipeline',
      ];
      
      render(<TimelineItem {...defaultProps} highlights={highlights} />);
      
      highlights.forEach(highlight => {
        expect(screen.getByText(highlight)).toBeInTheDocument();
      });
    });

    it('renders correct number of highlight items', () => {
      const highlights = ['First', 'Second', 'Third'];
      const { container } = render(
        <TimelineItem {...defaultProps} highlights={highlights} />
      );
      
      const items = container.querySelectorAll('.timeline-highlight-item');
      expect(items).toHaveLength(3);
    });
  });

  describe('calculateStaggerDelay', () => {
    it('returns 0 for index 0', () => {
      expect(calculateStaggerDelay(0)).toBe(0);
    });

    it('returns correct delay for index 1 with default base delay', () => {
      expect(calculateStaggerDelay(1)).toBe(0.15);
    });

    it('returns correct delay for index 2 with default base delay', () => {
      expect(calculateStaggerDelay(2)).toBe(0.3);
    });

    it('uses custom base delay when provided', () => {
      expect(calculateStaggerDelay(2, 0.2)).toBe(0.4);
    });

    it('calculates delay proportionally to index', () => {
      const baseDelay = 0.1;
      for (let i = 0; i < 5; i++) {
        expect(calculateStaggerDelay(i, baseDelay)).toBe(i * baseDelay);
      }
    });
  });

  describe('Semantic Structure', () => {
    it('renders title as h3 element', () => {
      render(<TimelineItem {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent(defaultProps.title);
    });

    it('renders highlights as unordered list', () => {
      const highlights = ['Item 1', 'Item 2'];
      render(<TimelineItem {...defaultProps} highlights={highlights} />);
      
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders highlight items as list items', () => {
      const highlights = ['Item 1', 'Item 2'];
      render(<TimelineItem {...defaultProps} highlights={highlights} />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('Different Content Variations', () => {
    it('handles long title text', () => {
      const longTitle = 'Senior Software Development Engineer with Focus on Frontend Technologies';
      render(<TimelineItem {...defaultProps} title={longTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles long organization name', () => {
      const longOrg = 'International Technology Solutions Corporation Limited';
      render(<TimelineItem {...defaultProps} organization={longOrg} />);
      
      expect(screen.getByText(longOrg)).toBeInTheDocument();
    });

    it('handles various date formats', () => {
      const dateFormats = [
        '2020 - Present',
        'Jan 2020 - Dec 2024',
        '2020',
        'Summer 2020',
      ];

      dateFormats.forEach(date => {
        const { unmount } = render(<TimelineItem {...defaultProps} date={date} />);
        expect(screen.getByText(date)).toBeInTheDocument();
        unmount();
      });
    });

    it('handles multiline description', () => {
      const longDescription = 'This is a very long description that spans multiple lines. It includes details about the role, responsibilities, and achievements. The component should handle this gracefully.';
      
      render(<TimelineItem {...defaultProps} description={longDescription} />);
      
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });
});
