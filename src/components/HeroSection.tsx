/**
 * HeroSection Component
 * 
 * The introductory section featuring the developer's profile picture and intro text.
 * Uses RevealWrapper for scroll-triggered entrance animations.
 * Includes floating decorative elements with parallax effects.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.3
 */

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useAnimationContext } from '../context/AnimationContext';
import './HeroSection.css';

/**
 * Props for HeroSection component
 */
export interface HeroSectionProps {
  /** URL of the profile image */
  profileImage: string;
  /** Main intro text to display */
  introText: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional name to display */
  name?: string;
}

/**
 * Default intro text for the hero section
 */
export const DEFAULT_INTRO_TEXT = "Hey, I am a software developer passionate about creating beautiful and functional web experiences.";

/**
 * HeroSection Component
 * 
 * Displays the developer's profile picture and introduction with entrance animations.
 * Fits above the fold (100vh) as per requirement 1.5.
 */

export function HeroSection({
  profileImage,
  introText = DEFAULT_INTRO_TEXT,
  subtitle,
  name = "Developer",
}: HeroSectionProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion, registerAnimation, unregisterAnimation } = useAnimationContext();
  const [hasAnimatedImage, setHasAnimatedImage] = useState(false);

  // Profile image entrance animation
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement || isReducedMotion) return;

    // If already animated, keep visible
    if (hasAnimatedImage) {
      gsap.set(imageElement, {
        scale: 1,
        opacity: 1,
        rotate: 0,
      });
      return;
    }

    const animationId = `hero-image-${Math.random().toString(36).substr(2, 9)}`;

    // Always animate on first load
    const tl = gsap.timeline({
      onComplete: () => setHasAnimatedImage(true),
    });

    gsap.set(imageElement, {
      scale: 0.8,
      opacity: 0,
      rotate: -5,
    });

    tl.to(imageElement, {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 1.2,
      ease: 'back.out(1.7)',
      delay: 0.2,
    });

    registerAnimation(animationId, tl);

    return () => {
      unregisterAnimation(animationId);
    };
  }, [isReducedMotion, registerAnimation, unregisterAnimation, hasAnimatedImage]);

  return (
    <section
      id="hero"
      className="hero-section"
      aria-label="Hero section"
    >
      {/* Background gradient pattern */}
      <div className="hero-background-pattern" aria-hidden="true">
        <div className="hero-gradient-orb hero-gradient-orb-1" />
        <div className="hero-gradient-orb hero-gradient-orb-2" />
        <div className="hero-gradient-orb hero-gradient-orb-3" />
      </div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Profile Image */}
          <div className="hero-image-wrapper" ref={imageRef}>
            <div className="hero-image-glow" aria-hidden="true" />
            <img
              src={profileImage}
              alt={`Profile picture of ${name}`}
              className="hero-image"
              loading="eager"
            />
          </div>

          {/* Text Content */}
          <div className="hero-text-content">
            {/* Greeting */}
            <span className="hero-greeting">Hello, I'm</span>

            {/* Name */}
            <h1 className="hero-name">{name}</h1>

            {/* Intro text */}
            <p className="hero-intro">{introText}</p>

            {/* Optional subtitle */}
            {subtitle && (
              <p className="hero-subtitle">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
