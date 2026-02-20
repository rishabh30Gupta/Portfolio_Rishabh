/**
 * ProjectGallery Component Tests
 * Requirements: 6.1, 6.2, 6.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectGallery, type Project } from './ProjectGallery';

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

describe('ProjectGallery', () => {
  const sampleProjects: Project[] = [
    {
      id: 'project-1',
      title: 'Portfolio Website',
      description: 'A beautiful animated portfolio website.',
      image: 'https://example.com/project1.jpg',
      tags: ['React', 'TypeScript'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/user/repo1',
    },
    {
      id: 'project-2',
      title: 'E-commerce App',
      description: 'A full-stack e-commerce application.',
      image: 'https://example.com/project2.jpg',
      tags: ['Node.js', 'MongoDB'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the section with correct id', () => {
      render(<ProjectGallery projects={sampleProjects} />);
      expect(document.getElementById('projects')).toBeInTheDocument();
    });

    it('renders the default title', () => {
      render(<ProjectGallery projects={sampleProjects} />);
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    it('renders custom title when provided', () => {
      render(<ProjectGallery projects={sampleProjects} title="My Work" />);
      expect(screen.getByText('My Work')).toBeInTheDocument();
    });

    it('renders all projects', () => {
      render(<ProjectGallery projects={sampleProjects} />);
      expect(screen.getByText('Portfolio Website')).toBeInTheDocument();
      expect(screen.getByText('E-commerce App')).toBeInTheDocument();
    });

    it('renders project descriptions', () => {
      render(<ProjectGallery projects={sampleProjects} />);
      expect(screen.getByText('A beautiful animated portfolio website.')).toBeInTheDocument();
      expect(screen.getByText('A full-stack e-commerce application.')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-labelledby for section', () => {
      render(<ProjectGallery projects={sampleProjects} />);
      const section = document.getElementById('projects');
      expect(section).toHaveAttribute('aria-labelledby', 'projects-title');
    });

    it('renders projects in a list with proper role', () => {
      render(<ProjectGallery projects={sampleProjects} />);
      const list = screen.getByRole('list', { name: 'Project list' });
      expect(list).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty grid when no projects provided', () => {
      render(<ProjectGallery projects={[]} />);
      const list = screen.getByRole('list', { name: 'Project list' });
      expect(list.children).toHaveLength(0);
    });
  });
});
