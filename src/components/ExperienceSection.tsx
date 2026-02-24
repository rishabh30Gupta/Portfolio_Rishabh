/**
 * ExperienceSection Component
 * 
 * Displays the developer's work experience using TimelineItem components.
 * Features scroll-triggered entrance animations and consistent color scheme.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import { RevealWrapper } from './RevealWrapper';
import { TimelineItem } from './TimelineItem';
import { theme } from '../theme/theme';
import './ExperienceSection.css';

/**
 * Experience entry data structure
 */
export interface ExperienceEntry {
  /** Unique identifier for the entry */
  id: string;
  /** Job title */
  title: string;
  /** Company name */
  organization: string;
  /** Date or date range (e.g., "2020 - Present") */
  date: string;
  /** Description of the role */
  description: string;
  /** Optional highlights/achievements */
  highlights?: string[];
}

/**
 * Props for ExperienceSection component
 */
export interface ExperienceSectionProps {
  /** Array of experience entries to display */
  entries: ExperienceEntry[];
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
export const DEFAULT_EXPERIENCE_TITLE = 'Experience';

/**
 * Default section subtitle
 */
export const DEFAULT_EXPERIENCE_SUBTITLE = 'My professional journey and work history';

/**
 * ExperienceSection Component
 * 
 * Renders work experience entries in a timeline format with scroll-triggered animations.
 * Uses the mint green (#98FF98) and paperish white (#FFFEF2) color scheme.
 */
export function ExperienceSection({
  entries,
  title = DEFAULT_EXPERIENCE_TITLE,
  subtitle = DEFAULT_EXPERIENCE_SUBTITLE,
  className = '',
}: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className={`experience-section ${className}`.trim()}
      aria-label="Experience section"
    >
      <div className="experience-container">
        {/* Section Header */}
        <div className="experience-header">
          <RevealWrapper
            direction="up"
            delay={0}
            duration={theme.animation.duration.normal}
          >
            <h2 className="experience-title">{title}</h2>
          </RevealWrapper>

          {subtitle && (
            <RevealWrapper
              direction="up"
              delay={0.1}
              duration={theme.animation.duration.normal}
            >
              <p className="experience-subtitle">{subtitle}</p>
            </RevealWrapper>
          )}
        </div>

        {/* Timeline */}
        <div className="experience-timeline">
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              title={entry.title}
              organization={entry.organization}
              date={entry.date}
              description={entry.description}
              highlights={entry.highlights}
              index={index}
              icon={<BriefcaseIcon />}
            />
          ))}
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <RevealWrapper direction="fade" delay={0.2}>
            <p className="experience-empty">No experience entries to display.</p>
          </RevealWrapper>
        )}
      </div>
    </section>
  );
}

/**
 * Briefcase icon for timeline markers
 */
function BriefcaseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export default ExperienceSection;
