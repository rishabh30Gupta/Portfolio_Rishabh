/**
 * App Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock GSAP and ScrollTrigger
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: null })),
    fromTo: vi.fn(() => ({ kill: vi.fn(), scrollTrigger: null })),
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

describe('App', () => {
  it('renders the skip link for accessibility', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('has main content area with correct id', () => {
    render(<App />);
    expect(document.getElementById('main-content')).toBeInTheDocument();
  });

  it('renders the hero section', () => {
    render(<App />);
    expect(document.getElementById('hero')).toBeInTheDocument();
  });

  it('renders the navigation', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<App />);
    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('education')).toBeInTheDocument();
    expect(document.getElementById('experience')).toBeInTheDocument();
    expect(document.getElementById('achievements')).toBeInTheDocument();
    expect(document.getElementById('projects')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });
});
