/**
 * AchievementsSection Component Tests
 * 
 * Tests for the AchievementsSection component including:
 * - Rendering of achievements in a responsive grid layout
 * - Staggered entrance animations for cards
 * - Consistent color scheme usage
 * - Empty state handling
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AchievementsSection,
  type AchievementsSectionProps,
  type AchievementEntry,
  DEFAULT_ACHIEVEMENTS_TITLE,
  DEFAULT_ACHIEVEMENTS_SUBTITLE,
} from './AchievementsSection';

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

describe('AchievementsSection', () => {
  const sampleEntries: AchievementEntry[] = [
    {
      id: 'ach-1',
      title: 'Best Innovation Award',
      description: 'Recognized for developing an innovative solution at the company hackathon.',
      date: '2023',
    },
    {
      id: 'ach-2',
      title: 'Open Source Contributor',
      description: 'Top contributor to major open source projects with over 500 commits.',
      date: '2022',
    },
    {
      id: 'ach-3',
      title: 'AWS Certified Developer',
      description: 'Achieved AWS Developer Associate certification.',
    },
  ];

  const defaultProps: AchievementsSectionProps = {
    entries: sampleEntries,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the section with correct id', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      const section = document.getElementById('achievements');
      expect(section).toBeInTheDocument();
    });

    it('renders the default title', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      expect(screen.getByText(DEFAULT_ACHIEVEMENTS_TITLE)).toBeInTheDocument();
    });

    it('renders the default subtitle', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      expect(screen.getByText(DEFAULT_ACHIEVEMENTS_SUBTITLE)).toBeInTheDocument();
    });

    it('renders custom title when provided', () => {
      render(<AchievementsSection {...defaultProps} title="My Achievements" />);
      
      expect(screen.getByText('My Achievements')).toBeInTheDocument();
    });

    it('renders custom subtitle when provided', () => {
      render(<AchievementsSection {...defaultProps} subtitle="Things I'm proud of" />);
      
      expect(screen.getByText("Things I'm proud of")).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <AchievementsSection {...defaultProps} className="custom-class" />
      );
      
      const section = container.querySelector('.achievements-section');
      expect(section).toHaveClass('custom-class');
    });

    it('has correct aria-label for accessibility', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      const section = screen.getByRole('region', { name: 'Achievements section' });
      expect(section).toBeInTheDocument();
    });
  });

  describe('Achievement Entries', () => {
    it('renders all achievement entries', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      expect(screen.getByText('Best Innovation Award')).toBeInTheDocument();
      expect(screen.getByText('Open Source Contributor')).toBeInTheDocument();
      expect(screen.getByText('AWS Certified Developer')).toBeInTheDocument();
    });

    it('renders descriptions for all entries', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      expect(screen.getByText('Recognized for developing an innovative solution at the company hackathon.')).toBeInTheDocument();
      expect(screen.getByText('Top contributor to major open source projects with over 500 commits.')).toBeInTheDocument();
      expect(screen.getByText('Achieved AWS Developer Associate certification.')).toBeInTheDocument();
    });

    it('renders dates when provided', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      expect(screen.getByText('2023')).toBeInTheDocument();
      expect(screen.getByText('2022')).toBeInTheDocument();
    });

    it('renders correct number of achievement cards', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      const achievementCards = container.querySelectorAll('.achievement-card');
      expect(achievementCards).toHaveLength(3);
    });
  });

  describe('Grid Layout', () => {
    it('renders achievements in a grid container', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      expect(container.querySelector('.achievements-grid')).toBeInTheDocument();
    });

    it('grid contains all achievement cards', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      const grid = container.querySelector('.achievements-grid');
      const cards = grid?.querySelectorAll('.achievement-card');
      expect(cards).toHaveLength(3);
    });
  });

  describe('Empty State', () => {
    it('renders empty state message when no entries provided', () => {
      render(<AchievementsSection entries={[]} />);
      
      expect(screen.getByText('No achievements to display.')).toBeInTheDocument();
    });

    it('does not render grid when entries are empty', () => {
      const { container } = render(<AchievementsSection entries={[]} />);
      
      const achievementCards = container.querySelectorAll('.achievement-card');
      expect(achievementCards).toHaveLength(0);
    });

    it('renders empty state with correct styling class', () => {
      const { container } = render(<AchievementsSection entries={[]} />);
      
      expect(container.querySelector('.achievements-empty')).toBeInTheDocument();
    });
  });

  describe('Semantic Structure', () => {
    it('renders title as h2 element', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent(DEFAULT_ACHIEVEMENTS_TITLE);
    });

    it('renders as a section element', () => {
      render(<AchievementsSection {...defaultProps} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('contains grid container', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      expect(container.querySelector('.achievements-grid')).toBeInTheDocument();
    });
  });

  describe('Single Entry', () => {
    it('renders correctly with a single entry', () => {
      const singleEntry: AchievementEntry[] = [
        {
          id: 'ach-single',
          title: 'Employee of the Year',
          description: 'Recognized for outstanding performance.',
          date: '2024',
        },
      ];

      render(<AchievementsSection entries={singleEntry} />);
      
      expect(screen.getByText('Employee of the Year')).toBeInTheDocument();
      expect(screen.getByText('Recognized for outstanding performance.')).toBeInTheDocument();
    });
  });

  describe('Multiple Entries with Various Data', () => {
    it('handles entries without dates', () => {
      const entriesWithoutDates: AchievementEntry[] = [
        {
          id: 'ach-no-date',
          title: 'Community Leader',
          description: 'Led local tech community meetups.',
        },
      ];

      render(<AchievementsSection entries={entriesWithoutDates} />);
      
      expect(screen.getByText('Community Leader')).toBeInTheDocument();
    });

    it('renders many entries correctly', () => {
      const manyEntries: AchievementEntry[] = Array.from({ length: 6 }, (_, i) => ({
        id: `ach-${i}`,
        title: `Achievement ${i + 1}`,
        description: `Description for achievement ${i + 1}`,
        date: `202${i}`,
      }));

      const { container } = render(<AchievementsSection entries={manyEntries} />);
      
      const achievementCards = container.querySelectorAll('.achievement-card');
      expect(achievementCards).toHaveLength(6);
    });
  });

  describe('CSS Classes', () => {
    it('applies achievements-section class to container', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      expect(container.querySelector('.achievements-section')).toBeInTheDocument();
    });

    it('applies achievements-container class', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      expect(container.querySelector('.achievements-container')).toBeInTheDocument();
    });

    it('applies achievements-header class', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      expect(container.querySelector('.achievements-header')).toBeInTheDocument();
    });

    it('applies achievements-title class to title', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      expect(container.querySelector('.achievements-title')).toBeInTheDocument();
    });

    it('applies achievements-subtitle class to subtitle', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      expect(container.querySelector('.achievements-subtitle')).toBeInTheDocument();
    });
  });

  describe('Trophy Icon', () => {
    it('renders trophy icons for achievement cards', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      // Each achievement card should have an SVG icon
      const svgIcons = container.querySelectorAll('.achievement-card-icon svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('trophy icons have aria-hidden attribute', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      const svgIcons = container.querySelectorAll('.achievement-card-icon svg');
      svgIcons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Staggered Animations', () => {
    it('passes correct index to each achievement card for staggered animations', () => {
      const { container } = render(<AchievementsSection {...defaultProps} />);
      
      const achievementCards = container.querySelectorAll('.achievement-card');
      achievementCards.forEach((card, index) => {
        expect(card).toHaveAttribute('data-index', String(index));
      });
    });
  });

  describe('Custom Icons', () => {
    it('renders custom icons when provided', () => {
      const entriesWithCustomIcon: AchievementEntry[] = [
        {
          id: 'ach-custom-icon',
          title: 'Custom Icon Achievement',
          description: 'This has a custom icon.',
          icon: <span data-testid="custom-icon">🏆</span>,
        },
      ];

      render(<AchievementsSection entries={entriesWithCustomIcon} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });
});
