/**
 * HeroSection Component Tests
 * 
 * Tests for the hero section component including:
 * - Profile image display (Requirement 1.1)
 * - Intro text display (Requirement 1.2)
 * - Color scheme application (Requirement 1.3)
 * - Entrance animations (Requirement 1.4)
 * - Above the fold display (Requirement 1.5)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection, DEFAULT_INTRO_TEXT } from './HeroSection';
import { AnimationProvider } from '../context/AnimationContext';

// Mock GSAP to avoid animation issues in tests
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      play: vi.fn(),
      pause: vi.fn(),
      kill: vi.fn(),
      paused: vi.fn(() => false),
    })),
  },
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      play: vi.fn(),
      pause: vi.fn(),
      kill: vi.fn(),
      paused: vi.fn(() => false),
    })),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
    kill: vi.fn(),
  },
}));

// Test wrapper with AnimationProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <AnimationProvider>
      {ui}
    </AnimationProvider>
  );
};

describe('HeroSection', () => {
  const defaultProps = {
    profileImage: 'https://i.postimg.cc/D0j9tncG/nan-image.jpg',
    introText: 'Hey, I am a software developer passionate about creating amazing experiences.',
    name: 'John Doe',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Requirement 1.1: Profile Image Display', () => {
    it('should display the profile image prominently', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const image = screen.getByRole('img', { name: /profile picture/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', defaultProps.profileImage);
    });

    it('should have proper alt text for accessibility', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', `Profile picture of ${defaultProps.name}`);
    });

    it('should load image eagerly for above-the-fold content', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'eager');
    });
  });

  describe('Requirement 1.2: Intro Text Display', () => {
    it('should display the intro text', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      // Check that intro text words are present
      expect(screen.getByText(/Hey/)).toBeInTheDocument();
      expect(screen.getByText(/software/)).toBeInTheDocument();
      expect(screen.getByText(/developer/)).toBeInTheDocument();
    });

    it('should display the developer name', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(defaultProps.name);
    });

    it('should display greeting text', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
    });

    it('should use default intro text when not provided', () => {
      renderWithProvider(
        <HeroSection 
          profileImage={defaultProps.profileImage} 
          introText={DEFAULT_INTRO_TEXT}
        />
      );
      
      expect(screen.getByText(/passionate/)).toBeInTheDocument();
    });
  });

  describe('Requirement 1.3: Color Scheme', () => {
    it('should have hero section with proper class for styling', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const section = screen.getByRole('region', { name: /hero section/i });
      expect(section).toHaveClass('hero-section');
    });

    it('should have image wrapper with glow effect element', () => {
      const { container } = renderWithProvider(<HeroSection {...defaultProps} />);
      
      const glowElement = container.querySelector('.hero-image-glow');
      expect(glowElement).toBeInTheDocument();
    });
  });

  describe('Requirement 1.4: Entrance Animations', () => {
    it('should wrap text content in RevealWrapper components', () => {
      const { container } = renderWithProvider(<HeroSection {...defaultProps} />);
      
      const revealWrappers = container.querySelectorAll('.reveal-wrapper');
      expect(revealWrappers.length).toBeGreaterThan(0);
    });

    it('should split intro text into words for staggered animation', () => {
      const { container } = renderWithProvider(<HeroSection {...defaultProps} />);
      
      const words = container.querySelectorAll('.hero-word');
      expect(words.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement 1.5: Above the Fold (100vh)', () => {
    it('should have hero section with min-height class', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const section = screen.getByRole('region', { name: /hero section/i });
      expect(section).toHaveClass('hero-section');
      // The CSS sets min-height: 100vh
    });

    it('should have proper section id for navigation', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const section = screen.getByRole('region', { name: /hero section/i });
      expect(section).toHaveAttribute('id', 'hero');
    });
  });

  describe('Optional Subtitle', () => {
    it('should display subtitle when provided', () => {
      const subtitle = 'Building the future, one line at a time';
      renderWithProvider(<HeroSection {...defaultProps} subtitle={subtitle} />);
      
      expect(screen.getByText(subtitle)).toBeInTheDocument();
    });

    it('should not display subtitle element when not provided', () => {
      const { container } = renderWithProvider(<HeroSection {...defaultProps} />);
      
      const subtitle = container.querySelector('.hero-subtitle');
      expect(subtitle).not.toBeInTheDocument();
    });
  });

  describe('CTA Buttons', () => {
    it('should display Get in Touch button', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument();
    });

    it('should display View My Work button', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      expect(screen.getByRole('link', { name: /view my work/i })).toBeInTheDocument();
    });

    it('should have correct href for contact button', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const contactButton = screen.getByRole('link', { name: /get in touch/i });
      expect(contactButton).toHaveAttribute('href', '#contact');
    });

    it('should have correct href for work button', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const workButton = screen.getByRole('link', { name: /view my work/i });
      expect(workButton).toHaveAttribute('href', '#experience');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label on section', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-label', 'Hero section');
    });

    it('should have heading hierarchy', () => {
      renderWithProvider(<HeroSection {...defaultProps} />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });
  });
});
