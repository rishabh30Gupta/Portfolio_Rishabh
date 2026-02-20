/**
 * CloudLayer Component
 * 
 * Creates a dense layer of fluffy white clouds at the bottom of sections
 * that the user scrolls through to reveal the next section.
 * Inspired by hacknitr.com cloud transition effect.
 */

import { useEffect, useRef } from 'react';
import { useAnimationContext } from '../context/AnimationContext';
import './CloudLayer.css';

export interface CloudLayerProps {
  /** Position from top in vh units */
  topPosition?: number;
  /** Whether to show the cloud layer */
  enabled?: boolean;
}

export function CloudLayer({ topPosition = 70, enabled = true }: CloudLayerProps) {
  const { scrollProgress, isReducedMotion } = useAnimationContext();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layerRef.current || isReducedMotion) return;
    
    // Move clouds up as user scrolls, creating parallax effect
    const translateY = scrollProgress * -300;
    layerRef.current.style.transform = `translateY(${translateY}px)`;
  }, [scrollProgress, isReducedMotion]);

  if (!enabled || isReducedMotion) return null;

  return (
    <div 
      ref={layerRef}
      className="cloud-layer" 
      style={{ top: `${topPosition}vh` }}
      aria-hidden="true"
    >
      {/* Back layer - smaller, lighter clouds */}
      <div className="cloud-layer__back">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
          {/* Row of back clouds */}
          <ellipse cx="100" cy="350" rx="120" ry="80" className="cloud-back" />
          <ellipse cx="250" cy="320" rx="100" ry="70" className="cloud-back" />
          <ellipse cx="400" cy="340" rx="130" ry="85" className="cloud-back" />
          <ellipse cx="550" cy="310" rx="110" ry="75" className="cloud-back" />
          <ellipse cx="700" cy="350" rx="140" ry="90" className="cloud-back" />
          <ellipse cx="850" cy="320" rx="100" ry="70" className="cloud-back" />
          <ellipse cx="1000" cy="340" rx="120" ry="80" className="cloud-back" />
          <ellipse cx="1150" cy="310" rx="110" ry="75" className="cloud-back" />
          <ellipse cx="1300" cy="350" rx="130" ry="85" className="cloud-back" />
          <ellipse cx="1420" cy="330" rx="100" ry="70" className="cloud-back" />
        </svg>
      </div>

      {/* Middle layer */}
      <div className="cloud-layer__middle">
        <svg viewBox="0 0 1440 450" preserveAspectRatio="xMidYMax slice">
          {/* Fluffy cloud groups */}
          <g className="cloud-group">
            <ellipse cx="80" cy="380" rx="100" ry="70" className="cloud-mid" />
            <ellipse cx="150" cy="350" rx="80" ry="60" className="cloud-mid" />
            <ellipse cx="200" cy="390" rx="90" ry="65" className="cloud-mid" />
          </g>
          <g className="cloud-group">
            <ellipse cx="320" cy="360" rx="110" ry="75" className="cloud-mid" />
            <ellipse cx="400" cy="380" rx="95" ry="68" className="cloud-mid" />
            <ellipse cx="470" cy="350" rx="85" ry="62" className="cloud-mid" />
          </g>
          <g className="cloud-group">
            <ellipse cx="580" cy="390" rx="100" ry="70" className="cloud-mid" />
            <ellipse cx="660" cy="360" rx="90" ry="65" className="cloud-mid" />
            <ellipse cx="730" cy="385" rx="105" ry="72" className="cloud-mid" />
          </g>
          <g className="cloud-group">
            <ellipse cx="850" cy="355" rx="95" ry="68" className="cloud-mid" />
            <ellipse cx="930" cy="380" rx="110" ry="75" className="cloud-mid" />
            <ellipse cx="1000" cy="350" rx="85" ry="60" className="cloud-mid" />
          </g>
          <g className="cloud-group">
            <ellipse cx="1100" cy="385" rx="100" ry="70" className="cloud-mid" />
            <ellipse cx="1180" cy="355" rx="90" ry="65" className="cloud-mid" />
            <ellipse cx="1250" cy="380" rx="105" ry="72" className="cloud-mid" />
          </g>
          <g className="cloud-group">
            <ellipse cx="1350" cy="360" rx="95" ry="68" className="cloud-mid" />
            <ellipse cx="1420" cy="385" rx="80" ry="58" className="cloud-mid" />
          </g>
        </svg>
      </div>

      {/* Front layer - larger, more prominent clouds */}
      <div className="cloud-layer__front">
        <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice">
          {/* Dense fluffy front clouds - multiple rows */}
          {/* Bottom row */}
          <g className="cloud-front-group">
            <ellipse cx="-20" cy="480" rx="160" ry="110" className="cloud-front" />
            <ellipse cx="120" cy="450" rx="140" ry="100" className="cloud-front" />
            <ellipse cx="260" cy="475" rx="150" ry="105" className="cloud-front" />
            <ellipse cx="400" cy="455" rx="145" ry="100" className="cloud-front" />
            <ellipse cx="540" cy="480" rx="155" ry="108" className="cloud-front" />
            <ellipse cx="680" cy="450" rx="140" ry="98" className="cloud-front" />
            <ellipse cx="820" cy="475" rx="150" ry="105" className="cloud-front" />
            <ellipse cx="960" cy="455" rx="145" ry="100" className="cloud-front" />
            <ellipse cx="1100" cy="480" rx="155" ry="108" className="cloud-front" />
            <ellipse cx="1240" cy="450" rx="140" ry="98" className="cloud-front" />
            <ellipse cx="1380" cy="475" rx="150" ry="105" className="cloud-front" />
            <ellipse cx="1480" cy="460" rx="120" ry="90" className="cloud-front" />
          </g>
          {/* Second row */}
          <g className="cloud-front-group">
            <ellipse cx="60" cy="400" rx="130" ry="90" className="cloud-front" />
            <ellipse cx="200" cy="380" rx="120" ry="85" className="cloud-front" />
            <ellipse cx="340" cy="395" rx="135" ry="92" className="cloud-front" />
            <ellipse cx="480" cy="375" rx="125" ry="88" className="cloud-front" />
            <ellipse cx="620" cy="400" rx="140" ry="95" className="cloud-front" />
            <ellipse cx="760" cy="380" rx="130" ry="90" className="cloud-front" />
            <ellipse cx="900" cy="395" rx="135" ry="92" className="cloud-front" />
            <ellipse cx="1040" cy="375" rx="125" ry="88" className="cloud-front" />
            <ellipse cx="1180" cy="400" rx="140" ry="95" className="cloud-front" />
            <ellipse cx="1320" cy="380" rx="130" ry="90" className="cloud-front" />
            <ellipse cx="1440" cy="395" rx="120" ry="85" className="cloud-front" />
          </g>
          {/* Third row - top */}
          <g className="cloud-front-group">
            <ellipse cx="0" cy="320" rx="110" ry="75" className="cloud-front" />
            <ellipse cx="140" cy="300" rx="100" ry="70" className="cloud-front" />
            <ellipse cx="280" cy="315" rx="115" ry="78" className="cloud-front" />
            <ellipse cx="420" cy="295" rx="105" ry="72" className="cloud-front" />
            <ellipse cx="560" cy="320" rx="120" ry="80" className="cloud-front" />
            <ellipse cx="700" cy="300" rx="110" ry="75" className="cloud-front" />
            <ellipse cx="840" cy="315" rx="115" ry="78" className="cloud-front" />
            <ellipse cx="980" cy="295" rx="105" ry="72" className="cloud-front" />
            <ellipse cx="1120" cy="320" rx="120" ry="80" className="cloud-front" />
            <ellipse cx="1260" cy="300" rx="110" ry="75" className="cloud-front" />
            <ellipse cx="1400" cy="315" rx="100" ry="70" className="cloud-front" />
          </g>
        </svg>
      </div>

      {/* Extra bottom fill to ensure no gaps */}
      <div className="cloud-layer__fill"></div>
    </div>
  );
}

export default CloudLayer;
