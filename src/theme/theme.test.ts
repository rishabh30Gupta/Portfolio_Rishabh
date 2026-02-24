import { describe, it, expect } from 'vitest'
import { theme, cssVarNames } from './theme'

describe('Theme Configuration', () => {
  describe('Colors', () => {
    it('has mint green as primary color (#98FF98)', () => {
      expect(theme.colors.primary).toBe('#98FF98')
    })

    it('has paperish white as background color (#FFFEF2)', () => {
      expect(theme.colors.background).toBe('#FFFEF2')
    })

    it('has darker mint variant for primary dark', () => {
      expect(theme.colors.primaryDark).toBe('#7DD87D')
    })

    it('has all required color properties', () => {
      expect(theme.colors).toHaveProperty('primary')
      expect(theme.colors).toHaveProperty('primaryDark')
      expect(theme.colors).toHaveProperty('primaryLight')
      expect(theme.colors).toHaveProperty('background')
      expect(theme.colors).toHaveProperty('backgroundAlt')
      expect(theme.colors).toHaveProperty('text')
      expect(theme.colors).toHaveProperty('textLight')
      expect(theme.colors).toHaveProperty('accent')
      expect(theme.colors).toHaveProperty('error')
      expect(theme.colors).toHaveProperty('success')
    })
  })

  describe('Breakpoints', () => {
    it('has mobile breakpoint at 768px', () => {
      expect(theme.breakpoints.mobile).toBe(768)
    })

    it('has tablet breakpoint at 1024px', () => {
      expect(theme.breakpoints.tablet).toBe(1024)
    })

    it('has desktop breakpoint at 1200px', () => {
      expect(theme.breakpoints.desktop).toBe(1200)
    })
  })

  describe('Typography', () => {
    it('has font family defined', () => {
      expect(theme.typography.fontFamily).toContain('Inter')
    })

    it('has heading font defined', () => {
      expect(theme.typography.headingFont).toContain('Poppins')
    })

    it('has all font size properties', () => {
      expect(theme.typography.sizes).toHaveProperty('h1')
      expect(theme.typography.sizes).toHaveProperty('h2')
      expect(theme.typography.sizes).toHaveProperty('h3')
      expect(theme.typography.sizes).toHaveProperty('h4')
      expect(theme.typography.sizes).toHaveProperty('body')
      expect(theme.typography.sizes).toHaveProperty('small')
    })
  })

  describe('Spacing', () => {
    it('has section spacing defined', () => {
      expect(theme.spacing.section).toBe('6rem')
    })

    it('has container width defined', () => {
      expect(theme.spacing.container).toBe('1200px')
    })
  })

  describe('Animation', () => {
    it('has fast duration at 0.3s', () => {
      expect(theme.animation.duration.fast).toBe(0.3)
    })

    it('has normal duration at 0.6s', () => {
      expect(theme.animation.duration.normal).toBe(0.6)
    })

    it('has slow duration at 1s', () => {
      expect(theme.animation.duration.slow).toBe(1)
    })

    it('has GSAP easing functions defined', () => {
      expect(theme.animation.easing.smooth).toBe('power2.out')
      expect(theme.animation.easing.bounce).toBe('back.out(1.7)')
      expect(theme.animation.easing.elastic).toBe('elastic.out(1, 0.3)')
    })
  })

  describe('CSS Variable Names', () => {
    it('exports CSS variable names for colors', () => {
      expect(cssVarNames.colorPrimary).toBe('--color-primary')
      expect(cssVarNames.colorBackground).toBe('--color-background')
    })

    it('exports CSS variable names for breakpoints', () => {
      expect(cssVarNames.breakpointMobile).toBe('--breakpoint-mobile')
      expect(cssVarNames.breakpointTablet).toBe('--breakpoint-tablet')
      expect(cssVarNames.breakpointDesktop).toBe('--breakpoint-desktop')
    })
  })
})
