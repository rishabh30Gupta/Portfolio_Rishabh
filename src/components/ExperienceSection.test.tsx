/**
 * ExperienceSection Component Tests
 * 
 * Tests for the ExperienceSection component including:
 * - Rendering of work experience entries using TimelineItem components
 * - Section entrance animations
 * - Consistent color scheme usage
 * - Empty state handling
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ExperienceSection,
  type ExperienceSectionProps,
  type ExperienceEntry,
  DEFAULT_EXPERIENCE_TITLE,
  DEFAULT_EXPERIENCE_SUBTITLE,
} from './ExperienceSection';

// Mock the AnimationContext
vi.mock('../context/AnimationContext', () => ({
  useAnimationContext: () => ({
    scrollProgress: 0,
    currentSection: 'experience',
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

describe('ExperienceSection', () => {
  const sampleEntries: ExperienceEntry[] = [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      organization: 'Tech Corp',
      date: '2022 - Present',
      description: 'Leading development of cloud-native applications and mentoring junior developers.',
      highlights: ['Led team of 5 engineers', 'Reduced deployment time by 40%'],
    },
    {
      id: 'exp-2',
      title: 'Software Engineer',
      organization: 'StartupXYZ',
      date: '2020 - 2022',
      description: 'Built scalable microservices and implemented CI/CD pipelines.',
    },
  ];

  const defaultProps: ExperienceSectionProps = {
    entries: sampleEntries,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the section with correct id', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      const section = document.getElementById('experience');
      expect(section).toBeInTheDocument();
    });

    it('renders the default title', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      expect(screen.getByText(DEFAULT_EXPERIENCE_TITLE)).toBeInTheDocument();
    });

    it('renders the default subtitle', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      expect(screen.getByText(DEFAULT_EXPERIENCE_SUBTITLE)).toBeInTheDocument();
    });

    it('renders custom title when provided', () => {
      render(<ExperienceSection {...defaultProps} title="Work History" />);
      
      expect(screen.getByText('Work History')).toBeInTheDocument();
    });

    it('renders custom subtitle when provided', () => {
      render(<ExperienceSection {...defaultProps} subtitle="Where I've worked" />);
      
      expect(screen.getByText("Where I've worked")).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <ExperienceSection {...defaultProps} className="custom-class" />
      );
      
      const section = container.querySelector('.experience-section');
      expect(section).toHaveClass('custom-class');
    });

    it('has correct aria-label for accessibility', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      const section = screen.getByRole('region', { name: 'Experience section' });
      expect(section).toBeInTheDocument();
    });
  });

  describe('Experience Entries', () => {
    it('renders all experience entries', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('renders organization names for all entries', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('StartupXYZ')).toBeInTheDocument();
    });

    it('renders dates for all entries', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      expect(screen.getByText('2022 - Present')).toBeInTheDocument();
      expect(screen.getByText('2020 - 2022')).toBeInTheDocument();
    });

    it('renders descriptions for all entries', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      expect(screen.getByText('Leading development of cloud-native applications and mentoring junior developers.')).toBeInTheDocument();
      expect(screen.getByText('Built scalable microservices and implemented CI/CD pipelines.')).toBeInTheDocument();
    });

    it('renders highlights when provided', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      expect(screen.getByText('Led team of 5 engineers')).toBeInTheDocument();
      expect(screen.getByText('Reduced deployment time by 40%')).toBeInTheDocument();
    });

    it('renders correct number of timeline items', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      const timelineItems = container.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(2);
    });
  });

  describe('Empty State', () => {
    it('renders empty state message when no entries provided', () => {
      render(<ExperienceSection entries={[]} />);
      
      expect(screen.getByText('No experience entries to display.')).toBeInTheDocument();
    });

    it('does not render timeline when entries are empty', () => {
      const { container } = render(<ExperienceSection entries={[]} />);
      
      const timelineItems = container.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(0);
    });

    it('renders empty state with correct styling class', () => {
      const { container } = render(<ExperienceSection entries={[]} />);
      
      expect(container.querySelector('.experience-empty')).toBeInTheDocument();
    });
  });

  describe('Semantic Structure', () => {
    it('renders title as h2 element', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent(DEFAULT_EXPERIENCE_TITLE);
    });

    it('renders as a section element', () => {
      render(<ExperienceSection {...defaultProps} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('contains timeline container', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      expect(container.querySelector('.experience-timeline')).toBeInTheDocument();
    });
  });

  describe('Single Entry', () => {
    it('renders correctly with a single entry', () => {
      const singleEntry: ExperienceEntry[] = [
        {
          id: 'exp-single',
          title: 'Freelance Developer',
          organization: 'Self-Employed',
          date: '2023 - Present',
          description: 'Building custom web applications for clients.',
        },
      ];

      render(<ExperienceSection entries={singleEntry} />);
      
      expect(screen.getByText('Freelance Developer')).toBeInTheDocument();
      expect(screen.getByText('Self-Employed')).toBeInTheDocument();
    });
  });

  describe('Multiple Entries with Various Data', () => {
    it('handles entries without highlights', () => {
      const entriesWithoutHighlights: ExperienceEntry[] = [
        {
          id: 'exp-no-highlights',
          title: 'Junior Developer',
          organization: 'Small Agency',
          date: '2019 - 2020',
          description: 'Developed websites for local businesses.',
        },
      ];

      render(<ExperienceSection entries={entriesWithoutHighlights} />);
      
      expect(screen.getByText('Junior Developer')).toBeInTheDocument();
      // Should not have any list items for highlights
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('handles entries with empty highlights array', () => {
      const entriesWithEmptyHighlights: ExperienceEntry[] = [
        {
          id: 'exp-empty-highlights',
          title: 'Intern',
          organization: 'Big Tech',
          date: '2018',
          description: 'Summer internship program.',
          highlights: [],
        },
      ];

      render(<ExperienceSection entries={entriesWithEmptyHighlights} />);
      
      expect(screen.getByText('Intern')).toBeInTheDocument();
    });

    it('renders many entries correctly', () => {
      const manyEntries: ExperienceEntry[] = Array.from({ length: 5 }, (_, i) => ({
        id: `exp-${i}`,
        title: `Position ${i + 1}`,
        organization: `Company ${i + 1}`,
        date: `${2015 + i} - ${2016 + i}`,
        description: `Description for position ${i + 1}`,
      }));

      const { container } = render(<ExperienceSection entries={manyEntries} />);
      
      const timelineItems = container.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(5);
    });
  });

  describe('CSS Classes', () => {
    it('applies experience-section class to container', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      expect(container.querySelector('.experience-section')).toBeInTheDocument();
    });

    it('applies experience-container class', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      expect(container.querySelector('.experience-container')).toBeInTheDocument();
    });

    it('applies experience-header class', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      expect(container.querySelector('.experience-header')).toBeInTheDocument();
    });

    it('applies experience-title class to title', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      expect(container.querySelector('.experience-title')).toBeInTheDocument();
    });

    it('applies experience-subtitle class to subtitle', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      expect(container.querySelector('.experience-subtitle')).toBeInTheDocument();
    });
  });

  describe('Briefcase Icon', () => {
    it('renders briefcase icons for timeline markers', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      // Each timeline item should have an SVG icon
      const svgIcons = container.querySelectorAll('.timeline-marker svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('briefcase icons have aria-hidden attribute', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      const svgIcons = container.querySelectorAll('.timeline-marker svg');
      svgIcons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('briefcase icon has correct SVG structure', () => {
      const { container } = render(<ExperienceSection {...defaultProps} />);
      
      const svgIcon = container.querySelector('.timeline-marker svg');
      expect(svgIcon).toBeInTheDocument();
      
      // Check for briefcase-specific elements (rect and path)
      const rect = svgIcon?.querySelector('rect');
      const path = svgIcon?.querySelector('path');
      expect(rect).toBeInTheDocument();
      expect(path).toBeInTheDocument();
    });
  });
});
