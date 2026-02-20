/**
 * PlantAnimation Component
 * 
 * Animated growing plant/seedling in the background that grows as user scrolls.
 * Uses SVG paths with GSAP animations for organic growth effect.
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimationContext } from '../context/AnimationContext';
import './PlantAnimation.css';

gsap.registerPlugin(ScrollTrigger);

export function PlantAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useAnimationContext();

  useEffect(() => {
    if (!containerRef.current || isReducedMotion) return;

    // Always animate on first load (plant is in hero section)
    // Animate stem growing
    const stemAnimation = gsap.fromTo('.plant-stem',
      { strokeDashoffset: 200 },
      {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.out',
        delay: 0.5,
      }
    );

    // Animate leaves appearing
    const leavesAnimation = gsap.fromTo('.plant-leaf',
      { scale: 0, opacity: 0, transformOrigin: 'bottom center' },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.3,
        ease: 'back.out(1.7)',
        delay: 0.8,
      }
    );

    // Gentle sway animation for leaves - continuous subtle animation
    const swayAnimation = gsap.to('.plant-leaf', {
      rotation: '+=5',
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.2,
    });

    return () => {
      stemAnimation.kill();
      leavesAnimation.kill();
      swayAnimation.kill();
    };
  }, [isReducedMotion]);

  return (
    <div ref={containerRef} className="plant-animation" aria-hidden="true">
      <svg
        viewBox="0 0 200 400"
        className="plant-svg"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* Main stem */}
        <path
          className="plant-stem"
          d="M100 400 Q100 350 95 300 Q90 250 100 200 Q110 150 100 100"
          fill="none"
          stroke="#7dd87d"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="200"
        />
        
        {/* Left leaf 1 (bottom) */}
        <path
          className="plant-leaf"
          d="M95 320 Q60 310 50 280 Q55 300 70 310 Q85 318 95 320"
          fill="#98FF98"
          stroke="#7dd87d"
          strokeWidth="1.5"
        />
        
        {/* Right leaf 1 (bottom) */}
        <path
          className="plant-leaf"
          d="M100 300 Q135 290 150 260 Q145 280 130 295 Q115 305 100 300"
          fill="#98FF98"
          stroke="#7dd87d"
          strokeWidth="1.5"
        />
        
        {/* Left leaf 2 (middle) */}
        <path
          className="plant-leaf"
          d="M98 250 Q55 235 40 200 Q50 225 70 240 Q88 250 98 250"
          fill="#a8ffa8"
          stroke="#7dd87d"
          strokeWidth="1.5"
        />
        
        {/* Right leaf 2 (middle) */}
        <path
          className="plant-leaf"
          d="M102 220 Q145 205 165 170 Q155 195 135 215 Q115 225 102 220"
          fill="#a8ffa8"
          stroke="#7dd87d"
          strokeWidth="1.5"
        />
        
        {/* Left leaf 3 (top) */}
        <path
          className="plant-leaf"
          d="M100 170 Q65 150 45 115 Q60 140 80 158 Q95 168 100 170"
          fill="#b8ffb8"
          stroke="#7dd87d"
          strokeWidth="1.5"
        />
        
        {/* Right leaf 3 (top) */}
        <path
          className="plant-leaf"
          d="M100 140 Q135 120 155 85 Q145 110 125 130 Q110 142 100 140"
          fill="#b8ffb8"
          stroke="#7dd87d"
          strokeWidth="1.5"
        />
        
        {/* Top sprout/bud */}
        <ellipse
          className="plant-leaf plant-bud"
          cx="100"
          cy="95"
          rx="12"
          ry="18"
          fill="#98FF98"
          stroke="#7dd87d"
          strokeWidth="1.5"
        />
        
        {/* Inner bud detail */}
        <path
          className="plant-leaf"
          d="M100 85 Q95 95 100 105 Q105 95 100 85"
          fill="#7dd87d"
          stroke="none"
        />
      </svg>
    </div>
  );
}

export default PlantAnimation;
