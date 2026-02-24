/**
 * Navbar Component Tests
 * 
 * Tests for the Navbar component including rendering, navigation,
 * and active state tracking.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 12.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { Navbar, DEFAULT_SECTIONS, type NavSection } from './Navbar';
import { AnimationProvider } from '../context/AnimationContext';
import { theme } from '../theme/theme';

// Mock useScrollController hook
const mockScrollToSection = vi.fn();
let mockCurrentSection = 'hero';

vi.mock('../hooks/useScrollController', () => ({
  useScrollController: () => ({
    scrollProgress: 0,
    currentSection: mockCurrentSection,
    scrollToSection: mockScrollToSection,
    isSectionInView: vi.fn(() => true),
  }),
}));

/**
 * Helper to render Navbar with AnimationProvider
 */
function renderNavbar(props = {}) {
  return render(
    <AnimationProvider>
      <Navbar {...props} />
    </AnimationProvider>
  );
}

/**
 * Helper to simulate mobile viewport
 */
function setMobileViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: theme.breakpoints.mobile - 1, // 767px
  });
  window.dispatchEvent(new Event('resize'));
}

/**
 * Helper to simulate desktop viewport
 */
function setDesktopViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: theme.breakpoints.desktop, // 1200px
  });
  window.dispatchEvent(new Event('resize'));
}

/**
 * Helper to get desktop nav element
 */
function getDesktopNav() {
  return document.querySelector('.desktop-nav') as HTMLElement;
}

describe('Navbar', () => {
  beforeEach(() => {
    mockCurrentSection = 'hero';
    mockScrollToSection.mockClear();
    // Default to desktop viewport
    setDesktopViewport();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders the navbar element', () => {
      renderNavbar();
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders with default logo text', () => {
      renderNavbar();
      expect(screen.getByText('NanEvo')).toBeInTheDocument();
    });

    it('renders with custom logo text', () => {
      renderNavbar({ logo: 'My Site' });
      expect(screen.getByText('My Site')).toBeInTheDocument();
    });

    it('renders all default section links in desktop nav', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      DEFAULT_SECTIONS.forEach((section) => {
        expect(within(desktopNav).getByText(section.label)).toBeInTheDocument();
      });
    });

    it('renders exactly five default section links in desktop nav', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const menuItems = within(desktopNav).getAllByRole('menuitem');
      expect(menuItems).toHaveLength(5);
    });

    it('renders custom sections when provided', () => {
      const customSections: NavSection[] = [
        { id: 'about', label: 'About' },
        { id: 'work', label: 'Work' },
      ];
      
      renderNavbar({ sections: customSections });
      const desktopNav = getDesktopNav();
      
      expect(within(desktopNav).getByText('About')).toBeInTheDocument();
      expect(within(desktopNav).getByText('Work')).toBeInTheDocument();
      expect(within(desktopNav).queryByText('Education')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      renderNavbar({ className: 'custom-navbar' });
      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('custom-navbar');
    });
  });

  describe('Fixed Position (Requirement 2.3)', () => {
    it('has fixed position styling', () => {
      renderNavbar();
      const nav = screen.getByRole('navigation');
      expect(nav.style.position).toBe('fixed');
    });

    it('is positioned at top of viewport', () => {
      renderNavbar();
      const nav = screen.getByRole('navigation');
      expect(nav.style.top).toBe('0px');
    });
  });

  describe('Navigation Click (Requirement 2.2)', () => {
    it('calls scrollToSection when nav link is clicked', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const educationLink = within(desktopNav).getByText('Education');
      fireEvent.click(educationLink);
      
      expect(mockScrollToSection).toHaveBeenCalledWith('education');
    });

    it('calls scrollToSection for each section', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      DEFAULT_SECTIONS.forEach((section) => {
        const link = within(desktopNav).getByText(section.label);
        fireEvent.click(link);
        expect(mockScrollToSection).toHaveBeenCalledWith(section.id);
      });
    });

    it('scrolls to first section when logo is clicked', () => {
      renderNavbar();
      
      const logo = screen.getByText('NanEvo');
      fireEvent.click(logo);
      
      expect(mockScrollToSection).toHaveBeenCalledWith('hero');
    });
  });

  describe('Active Link Indicator (Requirement 2.4)', () => {
    it('marks current section link as active', () => {
      mockCurrentSection = 'education';
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const educationLink = within(desktopNav).getByText('Education');
      expect(educationLink).toHaveAttribute('data-active', 'true');
    });

    it('sets aria-current on active link', () => {
      mockCurrentSection = 'experience';
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const experienceLink = within(desktopNav).getByText('Experience');
      expect(experienceLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark inactive sections as active', () => {
      mockCurrentSection = 'hero';
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const educationLink = within(desktopNav).getByText('Education');
      expect(educationLink).toHaveAttribute('data-active', 'false');
      expect(educationLink).not.toHaveAttribute('aria-current');
    });

    it('only one link is active at a time in desktop nav', () => {
      mockCurrentSection = 'achievements';
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const menuItems = within(desktopNav).getAllByRole('menuitem');
      const activeItems = menuItems.filter(
        (item) => item.getAttribute('data-active') === 'true'
      );
      
      expect(activeItems).toHaveLength(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('triggers navigation on Enter key', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const contactLink = within(desktopNav).getByText('Contact');
      fireEvent.keyDown(contactLink, { key: 'Enter' });
      
      expect(mockScrollToSection).toHaveBeenCalledWith('contact');
    });

    it('triggers navigation on Space key', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const achievementsLink = within(desktopNav).getByText('Achievements');
      fireEvent.keyDown(achievementsLink, { key: ' ' });
      
      expect(mockScrollToSection).toHaveBeenCalledWith('achievements');
    });

    it('does not trigger on other keys', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      const educationLink = within(desktopNav).getByText('Education');
      fireEvent.keyDown(educationLink, { key: 'Tab' });
      
      expect(mockScrollToSection).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper navigation role', () => {
      renderNavbar();
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('has menubar role on nav list', () => {
      renderNavbar();
      expect(screen.getByRole('menubar')).toBeInTheDocument();
    });

    it('has menuitem role on nav links', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      const menuItems = within(desktopNav).getAllByRole('menuitem');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('logo has accessible label', () => {
      renderNavbar();
      const logo = screen.getByLabelText('Go to home section');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Section Data Attributes', () => {
    it('each link has data-section attribute', () => {
      renderNavbar();
      const desktopNav = getDesktopNav();
      
      DEFAULT_SECTIONS.forEach((section) => {
        const link = within(desktopNav).getByText(section.label);
        expect(link).toHaveAttribute('data-section', section.id);
      });
    });
  });


  describe('Mobile Navigation (Requirements 2.6, 12.4)', () => {
    beforeEach(() => {
      setMobileViewport();
    });

    describe('Hamburger Menu', () => {
      it('shows hamburger button on mobile viewport', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        expect(hamburger).toBeInTheDocument();
        expect(hamburger.style.display).toBe('flex');
      });

      it('hides desktop nav on mobile viewport', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const desktopNav = getDesktopNav();
        expect(desktopNav).toHaveStyle({ display: 'none' });
      });

      it('hamburger button has correct aria-label when closed', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        expect(hamburger).toHaveAttribute('aria-label', 'Open menu');
        expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      });

      it('hamburger button has correct aria-label when open', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        fireEvent.click(hamburger);
        
        expect(hamburger).toHaveAttribute('aria-label', 'Close menu');
        expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    describe('Mobile Menu', () => {
      it('opens mobile menu when hamburger is clicked', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        const mobileMenu = screen.getByTestId('mobile-menu');
        
        // Menu should be closed initially (translated off-screen)
        expect(mobileMenu.style.transform).toBe('translateX(100%)');
        
        fireEvent.click(hamburger);
        
        // Menu should be open (translated to 0)
        expect(mobileMenu.style.transform).toBe('translateX(0)');
      });

      it('closes mobile menu when hamburger is clicked again', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        const mobileMenu = screen.getByTestId('mobile-menu');
        
        // Open menu
        fireEvent.click(hamburger);
        expect(mobileMenu.style.transform).toBe('translateX(0)');
        
        // Close menu
        fireEvent.click(hamburger);
        expect(mobileMenu.style.transform).toBe('translateX(100%)');
      });

      it('renders all section links in mobile menu', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        fireEvent.click(hamburger);
        
        const mobileMenu = screen.getByTestId('mobile-menu');
        
        DEFAULT_SECTIONS.forEach((section) => {
          const link = mobileMenu.querySelector(`[data-section="${section.id}"]`);
          expect(link).toBeInTheDocument();
          expect(link).toHaveTextContent(section.label);
        });
      });

      it('closes mobile menu when nav link is clicked', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        fireEvent.click(hamburger);
        
        const mobileMenu = screen.getByTestId('mobile-menu');
        const educationLink = mobileMenu.querySelector('[data-section="education"]');
        
        fireEvent.click(educationLink!);
        
        expect(mockScrollToSection).toHaveBeenCalledWith('education');
        expect(mobileMenu.style.transform).toBe('translateX(100%)');
      });

      it('closes mobile menu when overlay is clicked', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        fireEvent.click(hamburger);
        
        const mobileMenu = screen.getByTestId('mobile-menu');
        const overlay = screen.getByTestId('mobile-overlay');
        
        expect(mobileMenu.style.transform).toBe('translateX(0)');
        
        fireEvent.click(overlay);
        
        expect(mobileMenu.style.transform).toBe('translateX(100%)');
      });

      it('closes mobile menu on Escape key', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        fireEvent.click(hamburger);
        
        const mobileMenu = screen.getByTestId('mobile-menu');
        expect(mobileMenu.style.transform).toBe('translateX(0)');
        
        fireEvent.keyDown(document, { key: 'Escape' });
        
        expect(mobileMenu.style.transform).toBe('translateX(100%)');
      });

      it('prevents body scroll when mobile menu is open', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        
        expect(document.body.style.overflow).toBe('');
        
        fireEvent.click(hamburger);
        
        expect(document.body.style.overflow).toBe('hidden');
        
        fireEvent.click(hamburger);
        
        expect(document.body.style.overflow).toBe('');
      });

      it('mobile menu has proper accessibility attributes', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const mobileMenu = screen.getByTestId('mobile-menu');
        
        expect(mobileMenu).toHaveAttribute('role', 'dialog');
        expect(mobileMenu).toHaveAttribute('aria-modal', 'true');
        expect(mobileMenu).toHaveAttribute('aria-label', 'Mobile navigation menu');
      });
    });

    describe('Touch-Friendly Tap Targets', () => {
      it('mobile nav links have minimum 48px height for touch targets', async () => {
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        fireEvent.click(hamburger);
        
        const mobileMenu = screen.getByTestId('mobile-menu');
        const navLinks = mobileMenu.querySelectorAll('[role="menuitem"]');
        
        navLinks.forEach((link) => {
          expect((link as HTMLElement).style.minHeight).toBe('48px');
        });
      });
    });

    describe('Active State in Mobile Menu', () => {
      it('marks current section as active in mobile menu', async () => {
        mockCurrentSection = 'experience';
        
        await act(async () => {
          renderNavbar();
        });
        
        const hamburger = screen.getByTestId('hamburger-button');
        fireEvent.click(hamburger);
        
        const mobileMenu = screen.getByTestId('mobile-menu');
        const experienceLink = mobileMenu.querySelector('[data-section="experience"]');
        
        expect(experienceLink).toHaveAttribute('data-active', 'true');
        expect(experienceLink).toHaveAttribute('aria-current', 'page');
      });
    });
  });

  describe('Desktop Navigation (hidden on mobile)', () => {
    beforeEach(() => {
      setDesktopViewport();
    });

    it('hides hamburger button on desktop viewport', async () => {
      await act(async () => {
        renderNavbar();
      });
      
      const hamburger = screen.getByTestId('hamburger-button');
      expect(hamburger.style.display).toBe('none');
    });

    it('shows desktop nav on desktop viewport', async () => {
      await act(async () => {
        renderNavbar();
      });
      
      const desktopNav = getDesktopNav();
      expect(desktopNav).toHaveStyle({ display: 'flex' });
    });
  });
});
