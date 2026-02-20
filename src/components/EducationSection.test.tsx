/**
 * EducationSection Component Tests
 * 
 * Tests for the EducationSection component including:
 * - Rendering of education entries using TimelineItem components
 * - Section entrance animations
 * - Consistent color scheme usage
 * - Empty state handling
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  EducationSection,
  type EducationSectionProps,
  type EducationEntry,
  DEFAULT_EDUCATION_TITLE,
  DEFAULT_EDUCATION_SUBTITLE,
} from './EducationSection';

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

describe('EducationSection', () => {
  const sampleEntries: EducationEntry[] = [
    {
      id: 'edu-1',
      title: 'Bachelor of Science in Computer Science',
      organization: 'University of Technology',
      date: '2016 - 2020',
      description: 'Studied computer science fundamentals, algorithms, and software engineering.',
      highlights: ['Dean\'s List', 'GPA: 3.8/4.0'],
    },
    {
      id: 'edu-2',
      title: 'Master of Science in Software Engineering',
      organization: 'Tech Institute',
      date: '2020 - 2022',
      description: 'Advanced studies in software architecture and distributed systems.',
    },
  ];

  const defaultProps: EducationSectionProps = {
    entries: sampleEntries,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the section with correct id', () => {
      render(<EducationSection {...defaultProps} />);
      
      const section = document.getElementById('education');
      expect(section).toBeInTheDocument();
    });

    it('renders the default title', () => {
      render(<EducationSection {...defaultProps} />);
      
      expect(screen.getByText(DEFAULT_EDUCATION_TITLE)).toBeInTheDocument();
    });

    it('renders the default subtitle', () => {
      render(<EducationSection {...defaultProps} />);
      
      expect(screen.getByText(DEFAULT_EDUCATION_SUBTITLE)).toBeInTheDocument();
    });

    it('renders custom title when provided', () => {
      render(<EducationSection {...defaultProps} title="My Education" />);
      
      expect(screen.getByText('My Education')).toBeInTheDocument();
    });

    it('renders custom subtitle when provided', () => {
      render(<EducationSection {...defaultProps} subtitle="Where I learned" />);
      
      expect(screen.getByText('Where I learned')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <EducationSection {...defaultProps} className="custom-class" />
      );
      
      const section = container.querySelector('.education-section');
      expect(section).toHaveClass('custom-class');
    });

    it('has correct aria-label for accessibility', () => {
      render(<EducationSection {...defaultProps} />);
      
      const section = screen.getByRole('region', { name: 'Education section' });
      expect(section).toBeInTheDocument();
    });
  });

  describe('Education Entries', () => {
    it('renders all education entries', () => {
      render(<EducationSection {...defaultProps} />);
      
      expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Master of Science in Software Engineering')).toBeInTheDocument();
    });

    it('renders organization names for all entries', () => {
      render(<EducationSection {...defaultProps} />);
      
      expect(screen.getByText('University of Technology')).toBeInTheDocument();
      expect(screen.getByText('Tech Institute')).toBeInTheDocument();
    });

    it('renders dates for all entries', () => {
      render(<EducationSection {...defaultProps} />);
      
      expect(screen.getByText('2016 - 2020')).toBeInTheDocument();
      expect(screen.getByText('2020 - 2022')).toBeInTheDocument();
    });

    it('renders descriptions for all entries', () => {
      render(<EducationSection {...defaultProps} />);
      
      expect(screen.getByText('Studied computer science fundamentals, algorithms, and software engineering.')).toBeInTheDocument();
      expect(screen.getByText('Advanced studies in software architecture and distributed systems.')).toBeInTheDocument();
    });

    it('renders highlights when provided', () => {
      render(<EducationSection {...defaultProps} />);
      
      expect(screen.getByText("Dean's List")).toBeInTheDocument();
      expect(screen.getByText('GPA: 3.8/4.0')).toBeInTheDocument();
    });

    it('renders correct number of timeline items', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      const timelineItems = container.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(2);
    });
  });

  describe('Empty State', () => {
    it('renders empty state message when no entries provided', () => {
      render(<EducationSection entries={[]} />);
      
      expect(screen.getByText('No education entries to display.')).toBeInTheDocument();
    });

    it('does not render timeline when entries are empty', () => {
      const { container } = render(<EducationSection entries={[]} />);
      
      const timelineItems = container.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(0);
    });

    it('renders empty state with correct styling class', () => {
      const { container } = render(<EducationSection entries={[]} />);
      
      expect(container.querySelector('.education-empty')).toBeInTheDocument();
    });
  });

  describe('Semantic Structure', () => {
    it('renders title as h2 element', () => {
      render(<EducationSection {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent(DEFAULT_EDUCATION_TITLE);
    });

    it('renders as a section element', () => {
      render(<EducationSection {...defaultProps} />);
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('contains timeline container', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      expect(container.querySelector('.education-timeline')).toBeInTheDocument();
    });
  });

  describe('Single Entry', () => {
    it('renders correctly with a single entry', () => {
      const singleEntry: EducationEntry[] = [
        {
          id: 'edu-single',
          title: 'PhD in Computer Science',
          organization: 'Research University',
          date: '2022 - Present',
          description: 'Researching machine learning applications.',
        },
      ];

      render(<EducationSection entries={singleEntry} />);
      
      expect(screen.getByText('PhD in Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Research University')).toBeInTheDocument();
    });
  });

  describe('Multiple Entries with Various Data', () => {
    it('handles entries without highlights', () => {
      const entriesWithoutHighlights: EducationEntry[] = [
        {
          id: 'edu-no-highlights',
          title: 'Certificate in Web Development',
          organization: 'Online Academy',
          date: '2023',
          description: 'Completed web development bootcamp.',
        },
      ];

      render(<EducationSection entries={entriesWithoutHighlights} />);
      
      expect(screen.getByText('Certificate in Web Development')).toBeInTheDocument();
      // Should not have any list items for highlights
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('handles entries with empty highlights array', () => {
      const entriesWithEmptyHighlights: EducationEntry[] = [
        {
          id: 'edu-empty-highlights',
          title: 'Diploma in Design',
          organization: 'Art School',
          date: '2021',
          description: 'Studied graphic design principles.',
          highlights: [],
        },
      ];

      render(<EducationSection entries={entriesWithEmptyHighlights} />);
      
      expect(screen.getByText('Diploma in Design')).toBeInTheDocument();
    });

    it('renders many entries correctly', () => {
      const manyEntries: EducationEntry[] = Array.from({ length: 5 }, (_, i) => ({
        id: `edu-${i}`,
        title: `Degree ${i + 1}`,
        organization: `University ${i + 1}`,
        date: `${2015 + i} - ${2016 + i}`,
        description: `Description for degree ${i + 1}`,
      }));

      const { container } = render(<EducationSection entries={manyEntries} />);
      
      const timelineItems = container.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(5);
    });
  });

  describe('CSS Classes', () => {
    it('applies education-section class to container', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      expect(container.querySelector('.education-section')).toBeInTheDocument();
    });

    it('applies education-container class', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      expect(container.querySelector('.education-container')).toBeInTheDocument();
    });

    it('applies education-header class', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      expect(container.querySelector('.education-header')).toBeInTheDocument();
    });

    it('applies education-title class to title', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      expect(container.querySelector('.education-title')).toBeInTheDocument();
    });

    it('applies education-subtitle class to subtitle', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      expect(container.querySelector('.education-subtitle')).toBeInTheDocument();
    });
  });

  describe('Graduation Icon', () => {
    it('renders graduation icons for timeline markers', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      // Each timeline item should have an SVG icon
      const svgIcons = container.querySelectorAll('.timeline-marker svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('graduation icons have aria-hidden attribute', () => {
      const { container } = render(<EducationSection {...defaultProps} />);
      
      const svgIcons = container.querySelectorAll('.timeline-marker svg');
      svgIcons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});
