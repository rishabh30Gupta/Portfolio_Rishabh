/**
 * ProjectCard Component Tests
 * Requirements: 6.1, 6.3, 6.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard, type ProjectCardProps, calculateStaggerDelay } from './ProjectCard';

vi.mock('../context/AnimationContext', () => ({
  useAnimationContext: () => ({
    scrollProgress: 0,
    currentSection: 'projects',
    isReducedMotion: true,
    registerAnimation: vi.fn(),
    unregisterAnimation: vi.fn(),
  }),
}));

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

describe('ProjectCard', () => {
  const defaultProps: ProjectCardProps = {
    id: 'project-1',
    title: 'Portfolio Website',
    description: 'A beautiful animated portfolio website built with React and GSAP.',
    image: 'https://example.com/project-image.jpg',
    tags: ['React', 'TypeScript', 'GSAP'],
    index: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });


  describe('Rendering', () => {
    it('renders the title correctly', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByText('Portfolio Website')).toBeInTheDocument();
    });

    it('renders the description correctly', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByText('A beautiful animated portfolio website built with React and GSAP.')).toBeInTheDocument();
    });

    it('renders the project image with correct alt text', () => {
      render(<ProjectCard {...defaultProps} />);
      const image = screen.getByAltText('Screenshot of Portfolio Website project');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/project-image.jpg');
    });

    it('renders all tags', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('GSAP')).toBeInTheDocument();
    });

    it('renders tags in a list with proper role', () => {
      render(<ProjectCard {...defaultProps} />);
      const tagList = screen.getByRole('list', { name: 'Project technologies' });
      expect(tagList).toBeInTheDocument();
      const tagItems = screen.getAllByRole('listitem');
      expect(tagItems).toHaveLength(3);
    });
  });

  describe('Optional Links', () => {
    it('renders live demo link when provided', () => {
      render(<ProjectCard {...defaultProps} link="https://example.com/demo" />);
      const demoLink = screen.getByRole('link', { name: /view live demo/i });
      expect(demoLink).toBeInTheDocument();
      expect(demoLink).toHaveAttribute('href', 'https://example.com/demo');
      expect(demoLink).toHaveAttribute('target', '_blank');
      expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders GitHub link when provided', () => {
      render(<ProjectCard {...defaultProps} githubUrl="https://github.com/user/repo" />);
      const githubLink = screen.getByRole('link', { name: /view.*source code on github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/user/repo');
      expect(githubLink).toHaveAttribute('target', '_blank');
    });

    it('renders both links when both are provided', () => {
      render(
        <ProjectCard
          {...defaultProps}
          link="https://example.com/demo"
          githubUrl="https://github.com/user/repo"
        />
      );
      expect(screen.getByRole('link', { name: /view live demo/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /source code on github/i })).toBeInTheDocument();
    });

    it('does not render links section when no links provided', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Semantic Structure', () => {
    it('renders as an article element', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('includes data attributes for project identification', () => {
      render(<ProjectCard {...defaultProps} />);
      const article = screen.getByRole('article');
      expect(article).toHaveAttribute('data-project-id', 'project-1');
      expect(article).toHaveAttribute('data-index', '0');
    });

    it('applies custom className when provided', () => {
      render(<ProjectCard {...defaultProps} className="custom-class" />);
      const article = screen.getByRole('article');
      expect(article).toHaveClass('project-card', 'custom-class');
    });

    it('uses lazy loading for images', () => {
      render(<ProjectCard {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Empty States', () => {
    it('handles empty tags array', () => {
      render(<ProjectCard {...defaultProps} tags={[]} />);
      expect(screen.queryByRole('list', { name: 'Project technologies' })).not.toBeInTheDocument();
    });
  });
});

describe('calculateStaggerDelay', () => {
  it('returns 0 for index 0', () => {
    expect(calculateStaggerDelay(0)).toBe(0);
  });

  it('returns correct delay for positive indices', () => {
    expect(calculateStaggerDelay(1)).toBe(0.15);
    expect(calculateStaggerDelay(2)).toBe(0.3);
    expect(calculateStaggerDelay(3)).toBeCloseTo(0.45, 10);
  });

  it('uses custom base delay when provided', () => {
    expect(calculateStaggerDelay(2, 0.2)).toBe(0.4);
    expect(calculateStaggerDelay(3, 0.1)).toBeCloseTo(0.3, 10);
  });

  it('handles large indices correctly', () => {
    expect(calculateStaggerDelay(10)).toBe(1.5);
    expect(calculateStaggerDelay(100, 0.1)).toBe(10);
  });
});
