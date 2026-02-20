/**
 * AchievementCard Component
 * 
 * A reusable card component for displaying achievements with hover animations
 * and scroll-triggered entrance animations using RevealWrapper.
 * 
 * Features:
 * - Display achievement title, description, and optional icon/date
 * - Hover animations with scale and shadow effects
 * - Scroll-triggered entrance animation via RevealWrapper
 * 
 * Requirements: 9.1, 9.2, 9.3
 */

import { type ReactNode } from 'react';
import { RevealWrapper } from './RevealWrapper';
import { theme } from '../theme/theme';
import './AchievementCard.css';

/**
 * Props for AchievementCard component
 */
export interface AchievementCardProps {
  /** Title of the achievement */
  title: string;
  /** Description of the achievement */
  description: string;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Optional date of the achievement */
  date?: string;
  /** Index for staggered animations (0-based) */
  index: number;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Calculate stagger delay based on index
 * Each card is delayed by a consistent amount multiplied by its index
 */
export function calculateStaggerDelay(index: number, baseDelay: number = 0.1): number {
  return index * baseDelay;
}

/**
 * AchievementCard Component
 * 
 * Displays a single achievement with scroll-triggered entrance animations
 * and hover effects. Uses RevealWrapper for entrance animations.
 */
export function AchievementCard({
  title,
  description,
  icon,
  date,
  index,
  className = '',
}: AchievementCardProps) {
  const staggerDelay = calculateStaggerDelay(index);

  return (
    <RevealWrapper
      direction="up"
      delay={staggerDelay}
      duration={theme.animation.duration.normal}
      distance={30}
    >
      <article
        className={`achievement-card ${className}`.trim()}
        data-index={index}
      >
        {/* Icon section */}
        {icon && (
          <div className="achievement-card-icon" aria-hidden="true">
            {icon}
          </div>
        )}

        {/* Content section */}
        <div className="achievement-card-content">
          {/* Date badge */}
          {date && (
            <span className="achievement-card-date">{date}</span>
          )}

          {/* Title */}
          <h3 className="achievement-card-title">{title}</h3>

          {/* Description */}
          <p className="achievement-card-description">{description}</p>
        </div>
      </article>
    </RevealWrapper>
  );
}

export default AchievementCard;
