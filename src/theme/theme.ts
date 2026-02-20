/**
 * Theme Configuration for Animated Portfolio Website
 * 
 * Defines the design system including colors, typography, spacing,
 * breakpoints, and animation settings.
 */

export interface ThemeConfig {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    background: string;
    backgroundAlt: string;
    text: string;
    textLight: string;
    accent: string;
    error: string;
    success: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      body: string;
      small: string;
    };
    weights: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    section: string;
    container: string;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      smooth: string;
      bounce: string;
      elastic: string;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const theme: ThemeConfig = {
  colors: {
    primary: '#98FF98',           // Mint green
    primaryDark: '#7DD87D',       // Darker mint
    primaryLight: '#B8FFB8',      // Lighter mint
    background: '#FFFEF2',        // Paperish white
    backgroundAlt: '#F5F4E8',     // Slightly darker paper
    text: '#2D3436',              // Dark text
    textLight: '#636E72',         // Light text
    accent: '#00B894',            // Accent color
    error: '#E74C3C',             // Error red
    success: '#27AE60',           // Success green
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    headingFont: "'Poppins', 'Inter', system-ui, sans-serif",
    sizes: {
      h1: '3.5rem',               // 56px
      h2: '2.5rem',               // 40px
      h3: '1.75rem',              // 28px
      h4: '1.25rem',              // 20px
      body: '1rem',               // 16px
      small: '0.875rem',          // 14px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.25rem',                // 4px
    sm: '0.5rem',                 // 8px
    md: '1rem',                   // 16px
    lg: '1.5rem',                 // 24px
    xl: '2rem',                   // 32px
    xxl: '3rem',                  // 48px
    section: '6rem',              // 96px
    container: '1200px',          // Max container width
  },
  breakpoints: {
    mobile: 768,                  // < 768px is mobile
    tablet: 1024,                 // 768px - 1023px is tablet
    desktop: 1200,                // >= 1200px is desktop
  },
  animation: {
    duration: {
      fast: 0.3,                  // 300ms
      normal: 0.6,                // 600ms
      slow: 1,                    // 1000ms
    },
    easing: {
      smooth: 'power2.out',
      bounce: 'back.out(1.7)',
      elastic: 'elastic.out(1, 0.3)',
    },
  },
  borderRadius: {
    sm: '0.25rem',                // 4px
    md: '0.5rem',                 // 8px
    lg: '1rem',                   // 16px
    full: '9999px',               // Fully rounded
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

// CSS variable names for use in stylesheets
export const cssVarNames = {
  // Colors
  colorPrimary: '--color-primary',
  colorPrimaryDark: '--color-primary-dark',
  colorPrimaryLight: '--color-primary-light',
  colorBackground: '--color-background',
  colorBackgroundAlt: '--color-background-alt',
  colorText: '--color-text',
  colorTextLight: '--color-text-light',
  colorAccent: '--color-accent',
  colorError: '--color-error',
  colorSuccess: '--color-success',
  
  // Typography
  fontFamily: '--font-family',
  fontHeading: '--font-heading',
  fontSizeH1: '--font-size-h1',
  fontSizeH2: '--font-size-h2',
  fontSizeH3: '--font-size-h3',
  fontSizeH4: '--font-size-h4',
  fontSizeBody: '--font-size-body',
  fontSizeSmall: '--font-size-small',
  
  // Spacing
  spacingXs: '--spacing-xs',
  spacingSm: '--spacing-sm',
  spacingMd: '--spacing-md',
  spacingLg: '--spacing-lg',
  spacingXl: '--spacing-xl',
  spacingXxl: '--spacing-xxl',
  spacingSection: '--spacing-section',
  containerWidth: '--container-width',
  
  // Breakpoints
  breakpointMobile: '--breakpoint-mobile',
  breakpointTablet: '--breakpoint-tablet',
  breakpointDesktop: '--breakpoint-desktop',
  
  // Animation
  durationFast: '--duration-fast',
  durationNormal: '--duration-normal',
  durationSlow: '--duration-slow',
  
  // Border radius
  radiusSm: '--radius-sm',
  radiusMd: '--radius-md',
  radiusLg: '--radius-lg',
  radiusFull: '--radius-full',
  
  // Shadows
  shadowSm: '--shadow-sm',
  shadowMd: '--shadow-md',
  shadowLg: '--shadow-lg',
} as const;

export default theme;
