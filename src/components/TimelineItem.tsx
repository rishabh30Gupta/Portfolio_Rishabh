/**
 * TimelineItem Component
 * 
 * A reusable component for displaying timeline entries (education/experience).
 * Features scroll-triggered entrance animations with stagger effects.
 * Styled with mint green accent line and markers.
 * 
 * Requirements: 7.1, 7.2, 7.4, 8.1, 8.2, 8.4
 */

import { type ReactNode } from 'react';
import { RevealWrapper } from './RevealWrapper';
import { theme } from '../theme/theme';
import './TimelineItem.css';

/**
 * Props for TimelineItem component
 */
export interface TimelineItemProps {
  /** Title of the timeline entry (e.g., degree, job title) */
  title: string;
  /** Organization name (e.g., university, company) */
  organization: string;
  /** Date or date range (e.g., "2020 - 2024") */
  date: string;
  /** Description of the entry */
  description: string;
  /** Optional icon to display in the marker */
  icon?: ReactNode;
  /** Index for staggered animations (0-based) */
  index: number;
  /** Optional highlights/bullet points */
  highlights?: string[];
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Calculate stagger delay based on index
 * Each item is delayed by a consistent amount multiplied by its index
 */
export function calculateStaggerDelay(index: number, baseDelay: number = 0.15): number {
  return index * baseDelay;
}

/**
 * TimelineItem Component
 * 
 * Displays a single timeline entry with scroll-triggered animations.
 * Uses RevealWrapper for entrance animations with stagger based on index.
 */
export function TimelineItem({
  title,
  organization,
  date,
  description,
  icon,
  index,
  highlights,
  className = '',
}: TimelineItemProps) {
  const staggerDelay = calculateStaggerDelay(index);

  return (
    <div 
      className={`timeline-item ${className}`.trim()}
      data-index={index}
    >
      {/* Timeline marker with optional icon */}
      <RevealWrapper
        direction="fade"
        delay={staggerDelay}
        duration={theme.animation.duration.fast}
      >
        <div className="timeline-marker" aria-hidden="true">
          {icon ? (
            <span className="timeline-marker-icon">{icon}</span>
          ) : (
            <span className="timeline-marker-dot" />
          )}
        </div>
      </RevealWrapper>

      {/* Timeline content */}
      <div className="timeline-content">
        {/* Date badge */}
        <RevealWrapper
          direction="left"
          delay={staggerDelay + 0.05}
          duration={theme.animation.duration.fast}
          distance={30}
        >
          <span className="timeline-date">{date}</span>
        </RevealWrapper>

        {/* Title */}
        <RevealWrapper
          direction="up"
          delay={staggerDelay + 0.1}
          duration={theme.animation.duration.normal}
          distance={20}
        >
          <h3 className="timeline-title">{title}</h3>
        </RevealWrapper>

        {/* Organization */}
        <RevealWrapper
          direction="up"
          delay={staggerDelay + 0.15}
          duration={theme.animation.duration.normal}
          distance={20}
        >
          <p className="timeline-organization">{organization}</p>
        </RevealWrapper>

        {/* Description */}
        <RevealWrapper
          direction="up"
          delay={staggerDelay + 0.2}
          duration={theme.animation.duration.normal}
          distance={20}
        >
          <p className="timeline-description">{description}</p>
        </RevealWrapper>

        {/* Optional highlights */}
        {highlights && highlights.length > 0 && (
          <RevealWrapper
            direction="up"
            delay={staggerDelay + 0.25}
            duration={theme.animation.duration.normal}
            stagger={0.05}
            staggerChildren
          >
            <ul className="timeline-highlights">
              {highlights.map((highlight, i) => (
                <li key={i} className="timeline-highlight-item">
                  {highlight}
                </li>
              ))}
            </ul>
          </RevealWrapper>
        )}
      </div>
    </div>
  );
}

export default TimelineItem;
