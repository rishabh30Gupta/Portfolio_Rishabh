/**
 * Navbar Component
 * 
 * Fixed navigation bar with smooth scroll links to all portfolio sections.
 * Features active link indicator based on current section and mint green accents.
 * Includes responsive hamburger menu for mobile viewports (<768px).
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 12.4
 */

import { useCallback, useState, useEffect, type CSSProperties } from 'react';
import { useScrollController } from '../hooks/useScrollController';
import { theme } from '../theme/theme';
import './Navbar.css';

/**
 * Navigation section configuration
 */
export interface NavSection {
  id: string;
  label: string;
}

/**
 * Props for Navbar component
 */
export interface NavbarProps {
  /** Custom sections to display (defaults to standard portfolio sections) */
  sections?: NavSection[];
  /** Additional CSS class name */
  className?: string;
  /** Logo text or element */
  logo?: string;
}

/**
 * Default portfolio sections
 */
export const DEFAULT_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Navbar styles
 */
const styles: Record<string, CSSProperties> = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: `all ${theme.animation.duration.fast}s ease`,
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  },
  container: {
    width: '100%',
    maxWidth: theme.spacing.container,
    margin: '0 auto',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: theme.spacing.lg,
  },
  navItem: {
    margin: 0,
    padding: 0,
  },
  navLink: {
    position: 'relative' as const,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    textDecoration: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast}s ease`,
    border: '2px solid transparent',
    background: 'transparent',
  },
  navLinkActive: {
    color: theme.colors.primary,
    backgroundColor: '#E8EEFF',
    border: '2px solid rgba(24, 46, 111, 0.2)',
    fontWeight: theme.typography.weights.bold,
  },
  activeIndicator: {
    position: 'absolute' as const,
    bottom: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '6px',
    height: '6px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    transition: `all ${theme.animation.duration.fast}s ease`,
  },
  // Mobile hamburger button
  hamburgerButton: {
    display: 'none',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    width: '28px',
    height: '20px',
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1002,
  },
  hamburgerLine: {
    width: '100%',
    height: '3px',
    backgroundColor: theme.colors.text,
    borderRadius: theme.borderRadius.full,
    transition: `all ${theme.animation.duration.fast}s ease`,
    transformOrigin: 'center',
  },
  // Mobile menu overlay
  mobileOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    opacity: 0,
    visibility: 'hidden' as const,
    transition: `opacity ${theme.animation.duration.fast}s ease, visibility ${theme.animation.duration.fast}s ease`,
  },
  mobileOverlayOpen: {
    opacity: 1,
    visibility: 'visible' as const,
  },
  // Mobile slide-out menu
  mobileMenu: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    width: '280px',
    maxWidth: '80vw',
    height: '100vh',
    backgroundColor: theme.colors.background,
    boxShadow: theme.shadows.lg,
    zIndex: 1001,
    transform: 'translateX(100%)',
    transition: `transform ${theme.animation.duration.normal}s cubic-bezier(0.4, 0, 0.2, 1)`,
    display: 'flex',
    flexDirection: 'column' as const,
    paddingTop: '80px',
  },
  mobileMenuOpen: {
    transform: 'translateX(0)',
  },
  mobileNavList: {
    listStyle: 'none',
    margin: 0,
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.sm,
  },
  mobileNavLink: {
    display: 'block',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    textDecoration: 'none',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast}s ease`,
    border: 'none',
    background: 'transparent',
    textAlign: 'left' as const,
    width: '100%',
    minHeight: '48px', // Touch-friendly tap target (48px minimum)
  },
  mobileNavLinkActive: {
    color: theme.colors.primary,
    backgroundColor: theme.colors.backgroundAlt,
  },
};

/**
 * Navbar Component
 * 
 * Provides fixed navigation with smooth scroll to sections and active state tracking.
 * Includes responsive hamburger menu for mobile viewports.
 */
export function Navbar({
  sections = DEFAULT_SECTIONS,
  className = '',
  logo = 'RishRealm',
}: NavbarProps) {
  const { currentSection, scrollToSection } = useScrollController({
    sectionIds: sections.map(s => s.id),
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Detect mobile viewport
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < theme.breakpoints.mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Close mobile menu on escape key
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  /**
   * Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  /**
   * Handle navigation link click
   */
  const handleNavClick = useCallback(
    (sectionId: string) => {
      scrollToSection(sectionId);
      setIsMobileMenuOpen(false);
    },
    [scrollToSection]
  );

  /**
   * Handle logo click - scroll to top
   */
  const handleLogoClick = useCallback(() => {
    scrollToSection(sections[0]?.id || 'hero');
    setIsMobileMenuOpen(false);
  }, [scrollToSection, sections]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, sectionId: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNavClick(sectionId);
      }
    },
    [handleNavClick]
  );

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  /**
   * Close mobile menu when clicking overlay
   */
  const handleOverlayClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Get hamburger line styles for animation
   */
  const getHamburgerLineStyle = (index: number): CSSProperties => {
    const baseStyle = styles.hamburgerLine;
    
    if (!isMobileMenuOpen) return baseStyle;
    
    // Animate to X shape when open
    if (index === 0) {
      return {
        ...baseStyle,
        transform: 'translateY(8.5px) rotate(45deg)',
      };
    }
    if (index === 1) {
      return {
        ...baseStyle,
        opacity: 0,
        transform: 'scaleX(0)',
      };
    }
    if (index === 2) {
      return {
        ...baseStyle,
        transform: 'translateY(-8.5px) rotate(-45deg)',
      };
    }
    
    return baseStyle;
  };

  return (
    <nav
      className={`navbar ${className}`.trim()}
      style={styles.navbar}
      role="navigation"
      aria-label="Main navigation"
    >
      <div style={styles.container}>
        {/* Logo with code icon */}
        <div
          className="navbar-logo"
          onClick={handleLogoClick}
          onKeyDown={(e) => handleKeyDown(e, sections[0]?.id || 'hero')}
          role="button"
          tabIndex={0}
          aria-label="Go to home section"
        >
          {/* Code icon SVG */}
          <svg 
            className="logo-icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 640 640"
            aria-hidden="true"
          >
            <path d="M392.8 65.2C375.8 60.3 358.1 70.2 353.2 87.2L225.2 535.2C220.3 552.2 230.2 569.9 247.2 574.8C264.2 579.7 281.9 569.8 286.8 552.8L414.8 104.8C419.7 87.8 409.8 70.1 392.8 65.2zM457.4 201.3C444.9 213.8 444.9 234.1 457.4 246.6L530.8 320L457.4 393.4C444.9 405.9 444.9 426.2 457.4 438.7C469.9 451.2 490.2 451.2 502.7 438.7L598.7 342.7C611.2 330.2 611.2 309.9 598.7 297.4L502.7 201.4C490.2 188.9 469.9 188.9 457.4 201.4zM182.7 201.3C170.2 188.8 149.9 188.8 137.4 201.3L41.4 297.3C28.9 309.8 28.9 330.1 41.4 342.6L137.4 438.6C149.9 451.1 170.2 451.1 182.7 438.6C195.2 426.1 195.2 405.8 182.7 393.3L109.3 320L182.6 246.6C195.1 234.1 195.1 213.8 182.6 201.3z"/>
          </svg>
          <span className="logo-text">{logo}</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul 
          style={{
            ...styles.navList,
            display: isMobile ? 'none' : 'flex',
          }} 
          role="menubar"
          className="desktop-nav"
        >
          {sections.map((section) => {
            const isActive = currentSection === section.id;
            
            return (
              <li key={section.id} style={styles.navItem} role="none">
                <button
                  role="menuitem"
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  }}
                  onClick={() => handleNavClick(section.id)}
                  onKeyDown={(e) => handleKeyDown(e, section.id)}
                  aria-current={isActive ? 'page' : undefined}
                  data-section={section.id}
                  data-active={isActive}
                  type="button"
                >
                  {section.label}
                  {isActive && <span style={styles.activeIndicator} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          style={{
            ...styles.hamburgerButton,
            display: isMobile ? 'flex' : 'none',
          }}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          type="button"
          className="hamburger-button"
          data-testid="hamburger-button"
        >
          <span style={getHamburgerLineStyle(0)} aria-hidden="true" />
          <span style={getHamburgerLineStyle(1)} aria-hidden="true" />
          <span style={getHamburgerLineStyle(2)} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        style={{
          ...styles.mobileOverlay,
          ...(isMobileMenuOpen ? styles.mobileOverlayOpen : {}),
        }}
        onClick={handleOverlayClick}
        aria-hidden="true"
        className="mobile-overlay"
        data-testid="mobile-overlay"
      />

      {/* Mobile Slide-out Menu */}
      <div
        id="mobile-menu"
        style={{
          ...styles.mobileMenu,
          ...(isMobileMenuOpen ? styles.mobileMenuOpen : {}),
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className="mobile-menu"
        data-testid="mobile-menu"
      >
        <ul style={styles.mobileNavList} role="menu">
          {sections.map((section) => {
            const isActive = currentSection === section.id;
            
            return (
              <li key={section.id} role="none">
                <button
                  role="menuitem"
                  style={{
                    ...styles.mobileNavLink,
                    ...(isActive ? styles.mobileNavLinkActive : {}),
                  }}
                  onClick={() => handleNavClick(section.id)}
                  onKeyDown={(e) => handleKeyDown(e, section.id)}
                  aria-current={isActive ? 'page' : undefined}
                  data-section={section.id}
                  data-active={isActive}
                  type="button"
                >
                  {section.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
