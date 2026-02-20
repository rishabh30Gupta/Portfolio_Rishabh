/**
 * AchievementsSection Component
 * 
 * Displays the developer's achievements and accomplishments in a responsive grid layout.
 * Features scroll-triggered staggered entrance animations using AchievementCard components.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */

import { RevealWrapper } from './RevealWrapper';
import { AchievementCard } from './AchievementCard';
import { theme } from '../theme/theme';
import './AchievementsSection.css';
import { type ReactNode } from 'react';

/**
 * Achievement entry data structure
 */
export interface AchievementEntry {
  /** Unique identifier for the achievement */
  id: string;
  /** Title of the achievement */
  title: string;
  /** Description of the achievement */
  description: string;
  /** Optional date of the achievement */
  date?: string;
  /** Optional icon to display */
  icon?: ReactNode;
}

/**
 * Props for AchievementsSection component
 */
export interface AchievementsSectionProps {
  /** Array of achievement entries to display */
  entries: AchievementEntry[];
  /** Optional section title */
  title?: string;
  /** Optional section subtitle */
  subtitle?: string;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Default section title
 */
export const DEFAULT_ACHIEVEMENTS_TITLE = 'Achievements';

/**
 * Default section subtitle
 */
export const DEFAULT_ACHIEVEMENTS_SUBTITLE = 'Notable accomplishments and milestones';

/**
 * AchievementsSection Component
 * 
 * Renders achievements in a responsive grid layout with staggered entrance animations.
 * Uses the mint green (#98FF98) and paperish white (#FFFEF2) color scheme.
 */
export function AchievementsSection({
  entries,
  title = DEFAULT_ACHIEVEMENTS_TITLE,
  subtitle = DEFAULT_ACHIEVEMENTS_SUBTITLE,
  className = '',
}: AchievementsSectionProps) {
  return (
    <section
      id="achievements"
      className={`achievements-section ${className}`.trim()}
      aria-label="Achievements section"
    >
      <div className="achievements-container">
        {/* Section Header */}
        <div className="achievements-header">
          <RevealWrapper
            direction="up"
            delay={0}
            duration={theme.animation.duration.normal}
          >
            <h2 className="achievements-title">{title}</h2>
          </RevealWrapper>

          {subtitle && (
            <RevealWrapper
              direction="up"
              delay={0.1}
              duration={theme.animation.duration.normal}
            >
              <p className="achievements-subtitle">{subtitle}</p>
            </RevealWrapper>
          )}
        </div>

        {/* Achievements Grid */}
        <div className="achievements-grid">
          {entries.map((entry, index) => (
            <AchievementCard
              key={entry.id}
              title={entry.title}
              description={entry.description}
              date={entry.date}
              icon={entry.icon || <TrophyIcon />}
              index={index}
            />
          ))}
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <RevealWrapper direction="fade" delay={0.2}>
            <p className="achievements-empty">No achievements to display.</p>
          </RevealWrapper>
        )}
      </div>
    </section>
  );
}

/**
 * Trophy icon for achievement cards
 */
function TrophyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export default AchievementsSection;
