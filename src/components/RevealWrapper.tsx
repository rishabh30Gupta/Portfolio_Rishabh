/**
 * RevealWrapper Component
 * 
 * A reusable component that wraps content and animates it when it enters the viewport.
 * Uses GSAP ScrollTrigger for scroll-triggered reveal animations.
 * 
 * Supports:
 * - Direction variants: up, down, left, right, fade
 * - Stagger animations for multiple children
 * - Configurable delay, duration, and trigger position
 * 
 * Requirements: 3.4, 5.4
 */

import { useRef, useEffect, useState, type ReactNode, Children, isValidElement } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimationContext } from '../context/AnimationContext';
import { theme } from '../theme/theme';

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

/**
 * Direction variants for reveal animations
 */
export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

/**
 * Props for RevealWrapper component
 */
export interface RevealWrapperProps {
  /** Content to animate */
  children: ReactNode;
  /** Direction of the reveal animation */
  direction?: RevealDirection;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of the animation (in seconds) */
  duration?: number;
  /** Stagger delay between children (in seconds) */
  stagger?: number;
  /** ScrollTrigger position (e.g., "top 80%") */
  triggerPosition?: string;
  /** Additional CSS class name */
  className?: string;
  /** Whether to animate each child separately (for stagger) */
  staggerChildren?: boolean;
  /** Distance to animate from (in pixels) */
  distance?: number;
  /** Custom easing function (GSAP easing string) */
  easing?: string;
  /** Whether animation should only play once */
  once?: boolean;
  /** Callback when animation starts */
  onAnimationStart?: () => void;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
}

/**
 * Get initial transform values based on direction
 */
function getInitialTransform(direction: RevealDirection, distance: number): gsap.TweenVars {
  switch (direction) {
    case 'up':
      return { y: distance, opacity: 0 };
    case 'down':
      return { y: -distance, opacity: 0 };
    case 'left':
      return { x: distance, opacity: 0 };
    case 'right':
      return { x: -distance, opacity: 0 };
    case 'fade':
    default:
      return { opacity: 0 };
  }
}

/**
 * Get final transform values based on direction
 */
function getFinalTransform(direction: RevealDirection): gsap.TweenVars {
  switch (direction) {
    case 'up':
    case 'down':
      return { y: 0, opacity: 1 };
    case 'left':
    case 'right':
      return { x: 0, opacity: 1 };
    case 'fade':
    default:
      return { opacity: 1 };
  }
}

/**
 * RevealWrapper Component
 * 
 * Wraps content and animates it when it enters the viewport using GSAP ScrollTrigger.
 */
export function RevealWrapper({
  children,
  direction = 'up',
  delay = 0,
  duration = theme.animation.duration.normal,
  stagger = 0.1,
  triggerPosition = 'top 80%',
  className = '',
  staggerChildren = false,
  distance = 50,
  easing = theme.animation.easing.smooth,
  once = true,
  onAnimationStart,
  onAnimationComplete,
}: RevealWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { isReducedMotion, registerAnimation, unregisterAnimation } = useAnimationContext();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Generate unique ID for this animation
    const animationId = `reveal-${Math.random().toString(36).substr(2, 9)}`;

    // If reduced motion is preferred, show content immediately without animation
    if (isReducedMotion) {
      gsap.set(container, { opacity: 1 });
      if (staggerChildren) {
        const childElements = container.children;
        gsap.set(childElements, { opacity: 1, x: 0, y: 0 });
      }
      setHasAnimated(true);
      return;
    }

    // If already animated, keep content visible
    if (hasAnimated) {
      const finalTransform = getFinalTransform(direction);
      if (staggerChildren && Children.count(children) > 1) {
        const childElements = container.children;
        gsap.set(childElements, finalTransform);
      } else {
        gsap.set(container, finalTransform);
      }
      return;
    }

    // Get initial and final transform values
    const initialTransform = getInitialTransform(direction, distance);
    const finalTransform = getFinalTransform(direction);

    // Check if element is in hero section (should always animate on first load)
    const isInHero = container.closest('#hero') !== null;

    // Check if element is already in viewport on mount (but not in hero)
    const rect = container.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    // If already in viewport and NOT in hero, show immediately without animation
    if (isInViewport && !isInHero) {
      if (staggerChildren && Children.count(children) > 1) {
        const childElements = container.children;
        gsap.set(childElements, finalTransform);
      } else {
        gsap.set(container, finalTransform);
      }
      setHasAnimated(true);
      return;
    }

    // Create timeline
    const tl = gsap.timeline({
      paused: true,
      onStart: onAnimationStart,
      onComplete: () => {
        setHasAnimated(true);
        if (onAnimationComplete) onAnimationComplete();
      },
    });

    if (staggerChildren && Children.count(children) > 1) {
      // Animate each child with stagger
      const childElements = container.children;

      // Set initial state for all children
      gsap.set(childElements, initialTransform);

      // Animate children with stagger
      tl.to(childElements, {
        ...finalTransform,
        duration,
        stagger,
        ease: easing,
        delay,
      });
    } else {
      // Animate the container as a whole
      gsap.set(container, initialTransform);

      tl.to(container, {
        ...finalTransform,
        duration,
        ease: easing,
        delay,
      });
    }

    // For hero section, play immediately; for others, use ScrollTrigger
    if (isInHero) {
      tl.play();
      
      // Store timeline reference
      timelineRef.current = tl;

      // Register animation with context for lifecycle management
      registerAnimation(animationId, tl);

      // Cleanup for hero animations
      return () => {
        tl.kill();
        unregisterAnimation(animationId);
        timelineRef.current = null;
      };
    } else {
      // Create ScrollTrigger
      const scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: triggerPosition,
        onEnter: () => {
          tl.play();
        },
        // Don't reverse or replay when scrolling back
        once: true,
      });

      // Store timeline reference
      timelineRef.current = tl;

      // Register animation with context for lifecycle management
      registerAnimation(animationId, tl);

      // Cleanup includes scrollTrigger
      return () => {
        scrollTrigger.kill();
        tl.kill();
        unregisterAnimation(animationId);
        timelineRef.current = null;
      };
    }
  }, [
    children,
    direction,
    delay,
    duration,
    stagger,
    triggerPosition,
    staggerChildren,
    distance,
    easing,
    once,
    isReducedMotion,
    registerAnimation,
    unregisterAnimation,
    onAnimationStart,
    onAnimationComplete,
    hasAnimated,
  ]);

  // If staggerChildren is true, wrap each child in a div for proper animation
  const renderChildren = () => {
    if (staggerChildren && Children.count(children) > 1) {
      return Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return (
            <div key={index} className="reveal-child" style={{ willChange: 'transform, opacity' }}>
              {child}
            </div>
          );
        }
        return child;
      });
    }
    return children;
  };

  return (
    <div
      ref={containerRef}
      className={`reveal-wrapper ${className}`.trim()}
      style={{ willChange: 'transform, opacity' }}
    >
      {renderChildren()}
    </div>
  );
}

export default RevealWrapper;
