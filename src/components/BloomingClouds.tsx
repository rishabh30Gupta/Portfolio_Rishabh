/**
 * BloomingClouds Component
 * 
 * Cute fluffy clouds clustered naturally at the bottom of hero section
 * that spread apart when scrolling. Natural arrangement, not in a line.
 */

import { useState, useEffect } from 'react';
import { useAnimationContext } from '../context/AnimationContext';
import './BloomingClouds.css';

interface CloudConfig {
  id: string;
  variant: 1 | 2 | 3 | 4 | 5;
  width: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
}

// Cute fluffy cloud SVG paths
const CLOUD_PATHS = {
  1: 'M15 40 Q5 40 8 30 Q12 20 28 22 Q35 12 50 14 Q65 16 70 28 Q82 26 85 35 Q88 44 75 45 L15 45 Z',
  2: 'M12 42 Q2 40 8 28 Q15 18 35 22 Q42 8 58 12 Q75 15 78 30 Q92 28 90 40 Q88 48 72 46 L12 46 Z',
  3: 'M18 38 Q8 36 12 26 Q18 16 38 20 Q48 10 62 14 Q78 18 80 32 Q90 30 88 40 Q86 48 70 46 L18 46 Z',
  4: 'M10 44 Q0 42 5 32 Q10 22 25 24 Q32 14 48 16 Q62 18 68 30 Q80 28 82 38 Q84 46 68 46 L10 46 Z',
  5: 'M20 40 Q10 38 15 28 Q22 18 40 22 Q50 12 65 16 Q80 20 82 32 Q92 30 90 42 Q88 50 72 48 L20 48 Z',
};

// Desktop clouds - full arrangement
const DESKTOP_CLOUDS: CloudConfig[] = [
  // Bottom layer - largest clouds, foundation
  { id: 'c1', variant: 1, width: 200, startX: -8, startY: 96, endX: -40, endY: 60, opacity: 0.55 },
  { id: 'c2', variant: 2, width: 220, startX: 8, startY: 94, endX: -30, endY: 45, opacity: 0.6 },
  { id: 'c3', variant: 3, width: 190, startX: 22, startY: 97, endX: -15, endY: 75, opacity: 0.5 },
  { id: 'c4', variant: 4, width: 210, startX: 38, startY: 95, endX: 10, endY: 55, opacity: 0.55 },
  { id: 'c5', variant: 5, width: 230, startX: 52, startY: 96, endX: 50, endY: 40, opacity: 0.6 },
  { id: 'c6', variant: 1, width: 200, startX: 68, startY: 94, endX: 85, endY: 60, opacity: 0.55 },
  { id: 'c7', variant: 2, width: 215, startX: 82, startY: 97, endX: 110, endY: 50, opacity: 0.6 },
  { id: 'c8', variant: 3, width: 195, startX: 98, startY: 95, endX: 130, endY: 70, opacity: 0.5 },
  
  // Middle layer - medium clouds, fill gaps
  { id: 'c9', variant: 4, width: 160, startX: -2, startY: 91, endX: -35, endY: 35, opacity: 0.5 },
  { id: 'c10', variant: 5, width: 170, startX: 15, startY: 89, endX: -20, endY: 25, opacity: 0.55 },
  { id: 'c11', variant: 1, width: 155, startX: 30, startY: 92, endX: 5, endY: 40, opacity: 0.5 },
  { id: 'c12', variant: 2, width: 175, startX: 45, startY: 90, endX: 35, endY: 30, opacity: 0.55 },
  { id: 'c13', variant: 3, width: 165, startX: 58, startY: 91, endX: 60, endY: 25, opacity: 0.5 },
  { id: 'c14', variant: 4, width: 180, startX: 72, startY: 89, endX: 90, endY: 35, opacity: 0.55 },
  { id: 'c15', variant: 5, width: 160, startX: 88, startY: 92, endX: 115, endY: 30, opacity: 0.5 },
  { id: 'c16', variant: 1, width: 170, startX: 102, startY: 90, endX: 135, endY: 40, opacity: 0.55 },
  
  // Top layer - smaller cute clouds, add depth
  { id: 'c17', variant: 2, width: 120, startX: 5, startY: 86, endX: -25, endY: 15, opacity: 0.45 },
  { id: 'c18', variant: 3, width: 130, startX: 20, startY: 84, endX: -10, endY: 10, opacity: 0.5 },
  { id: 'c19', variant: 4, width: 115, startX: 35, startY: 87, endX: 15, endY: 18, opacity: 0.45 },
  { id: 'c20', variant: 5, width: 140, startX: 48, startY: 85, endX: 40, endY: 12, opacity: 0.5 },
  { id: 'c21', variant: 1, width: 125, startX: 62, startY: 86, endX: 65, endY: 15, opacity: 0.45 },
  { id: 'c22', variant: 2, width: 135, startX: 78, startY: 84, endX: 95, endY: 10, opacity: 0.5 },
  { id: 'c23', variant: 3, width: 120, startX: 92, startY: 87, endX: 120, endY: 18, opacity: 0.45 },
  
  // Extra fluffy accent clouds - fill remaining gaps
  { id: 'c24', variant: 4, width: 100, startX: 12, startY: 93, endX: -18, endY: 55, opacity: 0.4 },
  { id: 'c25', variant: 5, width: 110, startX: 42, startY: 93, endX: 25, endY: 50, opacity: 0.4 },
  { id: 'c26', variant: 1, width: 105, startX: 55, startY: 93, endX: 55, endY: 55, opacity: 0.4 },
  { id: 'c27', variant: 2, width: 115, startX: 75, startY: 93, endX: 100, endY: 50, opacity: 0.4 },
  { id: 'c28', variant: 3, width: 100, startX: 95, startY: 93, endX: 125, endY: 55, opacity: 0.4 },
  
  // Tiny cute clouds on top
  { id: 'c29', variant: 4, width: 85, startX: 28, startY: 82, endX: 0, endY: 5, opacity: 0.35 },
  { id: 'c30', variant: 5, width: 90, startX: 55, startY: 81, endX: 50, endY: 0, opacity: 0.35 },
  { id: 'c31', variant: 1, width: 80, startX: 85, startY: 82, endX: 105, endY: 5, opacity: 0.35 },
];

// Mobile clouds - fewer, simpler arrangement for performance
const MOBILE_CLOUDS: CloudConfig[] = [
  // Bottom layer
  { id: 'm1', variant: 1, width: 140, startX: -5, startY: 95, endX: -30, endY: 50, opacity: 0.5 },
  { id: 'm2', variant: 2, width: 150, startX: 20, startY: 96, endX: 0, endY: 40, opacity: 0.55 },
  { id: 'm3', variant: 3, width: 160, startX: 50, startY: 95, endX: 50, endY: 35, opacity: 0.55 },
  { id: 'm4', variant: 4, width: 150, startX: 80, startY: 96, endX: 100, endY: 40, opacity: 0.55 },
  { id: 'm5', variant: 5, width: 140, startX: 105, startY: 95, endX: 130, endY: 50, opacity: 0.5 },
  
  // Middle layer
  { id: 'm6', variant: 1, width: 110, startX: 10, startY: 91, endX: -15, endY: 25, opacity: 0.45 },
  { id: 'm7', variant: 2, width: 120, startX: 35, startY: 90, endX: 20, endY: 20, opacity: 0.5 },
  { id: 'm8', variant: 3, width: 130, startX: 65, startY: 91, endX: 70, endY: 22, opacity: 0.5 },
  { id: 'm9', variant: 4, width: 115, startX: 90, startY: 90, endX: 115, endY: 25, opacity: 0.45 },
  
  // Top accent
  { id: 'm10', variant: 5, width: 90, startX: 25, startY: 86, endX: 5, endY: 10, opacity: 0.4 },
  { id: 'm11', variant: 1, width: 100, startX: 50, startY: 85, endX: 50, endY: 5, opacity: 0.4 },
  { id: 'm12', variant: 2, width: 90, startX: 75, startY: 86, endX: 95, endY: 10, opacity: 0.4 },
];

export function BloomingClouds() {
  const { scrollProgress, isReducedMotion } = useAnimationContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isReducedMotion) return null;

  // Use appropriate cloud set
  const clouds = isMobile ? MOBILE_CLOUDS : DESKTOP_CLOUDS;

  // Bloom happens in the first 25% of scroll
  const bloomProgress = Math.min(scrollProgress * 4, 1);
  
  // Smooth ease-out for natural spreading
  const easedProgress = 1 - Math.pow(1 - bloomProgress, 3);

  return (
    <div className="blooming-clouds" aria-hidden="true">
      {clouds.map((cloud) => {
        const path = CLOUD_PATHS[cloud.variant];
        
        // Interpolate position
        const currentX = cloud.startX + (cloud.endX - cloud.startX) * easedProgress;
        const currentY = cloud.startY + (cloud.endY - cloud.startY) * easedProgress;
        
        // Fade out as they spread
        const currentOpacity = cloud.opacity * (1 - easedProgress * 0.85);
        
        // Scale down slightly as they spread
        const currentScale = 1 - easedProgress * 0.25;

        return (
          <div
            key={cloud.id}
            className="blooming-cloud"
            style={{
              left: `${currentX}%`,
              top: `${currentY}%`,
              width: cloud.width,
              height: cloud.width * 0.45,
              opacity: currentOpacity,
              transform: `translate(-50%, -50%) scale(${currentScale})`,
            }}
          >
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="cloud-svg">
              <path d={path} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

export default BloomingClouds;
