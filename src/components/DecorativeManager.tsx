/**
 * DecorativeManager Component
 * 
 * Orchestrates all decorative elements across the page including clouds,
 * path animations, and floating elements.
 * 
 * Features:
 * - Orchestrate all decorative elements across the page
 * - Calculate positions based on scroll progress
 * - Apply staggered entrance animations
 * 
 * Requirements: 5.3, 5.4, 5.5
 */

import { useAnimationContext } from '../context/AnimationContext';
import { CloudElement, type CloudSize } from './CloudElement';
import { PathAnimation } from './PathAnimation';
import './DecorativeManager.css';

/**
 * Cloud configuration
 */
interface CloudConfig {
  id: string;
  size: CloudSize;
  variant: 1 | 2 | 3;
  opacity: number;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  triggerStart: number;
  triggerEnd: number;
}

/**
 * Props for DecorativeManager component
 */
export interface DecorativeManagerProps {
  /** Whether to show decorative elements */
  enabled?: boolean;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Default cloud configurations
 */
const defaultClouds: CloudConfig[] = [
  // Hero section clouds - visible immediately
  {
    id: 'cloud-1',
    size: 'large',
    variant: 1,
    opacity: 0.7,
    startPosition: { x: 20, y: 80 },
    endPosition: { x: 100, y: 200 },
    triggerStart: 0,
    triggerEnd: 0.3,
  },
  {
    id: 'cloud-2',
    size: 'medium',
    variant: 2,
    opacity: 0.6,
    startPosition: { x: 60, y: 250 },
    endPosition: { x: 150, y: 400 },
    triggerStart: 0,
    triggerEnd: 0.4,
  },
  // Top right clouds - visible immediately
  {
    id: 'cloud-3',
    size: 'large',
    variant: 3,
    opacity: 0.65,
    startPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 200 : 1000, y: 100 },
    endPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 250 : 950, y: 220 },
    triggerStart: 0,
    triggerEnd: 0.35,
  },
  {
    id: 'cloud-4',
    size: 'medium',
    variant: 1,
    opacity: 0.55,
    startPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 180 : 1020, y: 350 },
    endPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 220 : 980, y: 500 },
    triggerStart: 0.1,
    triggerEnd: 0.45,
  },
  // Middle section clouds
  {
    id: 'cloud-5',
    size: 'large',
    variant: 2,
    opacity: 0.6,
    startPosition: { x: 30, y: 600 },
    endPosition: { x: 120, y: 750 },
    triggerStart: 0.2,
    triggerEnd: 0.55,
  },
  {
    id: 'cloud-6',
    size: 'small',
    variant: 1,
    opacity: 0.7,
    startPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 150 : 1050, y: 700 },
    endPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 180 : 1020, y: 850 },
    triggerStart: 0.3,
    triggerEnd: 0.65,
  },
  // Lower section clouds
  {
    id: 'cloud-7',
    size: 'medium',
    variant: 3,
    opacity: 0.6,
    startPosition: { x: 50, y: 1000 },
    endPosition: { x: 130, y: 1150 },
    triggerStart: 0.4,
    triggerEnd: 0.75,
  },
  {
    id: 'cloud-8',
    size: 'large',
    variant: 2,
    opacity: 0.55,
    startPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 220 : 980, y: 1100 },
    endPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 260 : 940, y: 1250 },
    triggerStart: 0.5,
    triggerEnd: 0.85,
  },
];

/**
 * SVG path data for the connecting path
 */
const connectingPathData = `
  M 50 0
  Q 20 200 50 400
  Q 80 600 50 800
  Q 20 1000 50 1200
  Q 80 1400 50 1600
  Q 20 1800 50 2000
`;

/**
 * DecorativeManager Component
 */
export function DecorativeManager({
  enabled = true,
  className = '',
}: DecorativeManagerProps) {
  const { scrollProgress, isReducedMotion } = useAnimationContext();

  // Don't render if disabled or reduced motion is preferred
  if (!enabled || isReducedMotion) {
    return null;
  }

  return (
    <div className={`decorative-manager ${className}`.trim()} aria-hidden="true">
      {/* Connecting Path */}
      <PathAnimation
        pathData={connectingPathData}
        scrollProgress={scrollProgress}
        strokeColor="var(--color-primary)"
        strokeWidth={2}
        viewBox="0 0 100 2000"
        className="decorative-path"
      />

      {/* Cloud Elements */}
      {defaultClouds.map((cloud) => (
        <CloudElement
          key={cloud.id}
          size={cloud.size}
          variant={cloud.variant}
          opacity={cloud.opacity}
          scrollProgress={scrollProgress}
          startPosition={cloud.startPosition}
          endPosition={cloud.endPosition}
          triggerStart={cloud.triggerStart}
          triggerEnd={cloud.triggerEnd}
        />
      ))}
    </div>
  );
}

export default DecorativeManager;
