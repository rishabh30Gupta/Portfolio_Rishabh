/**
 * EducationSection Component
 * 
 * Displays the developer's educational background using TimelineItem components.
 * Features scroll-triggered entrance animations and consistent color scheme.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import { RevealWrapper } from './RevealWrapper';
import { TimelineItem } from './TimelineItem';
import { theme } from '../theme/theme';
import './EducationSection.css';

/**
 * Education entry data structure
 */
export interface EducationEntry {
  /** Unique identifier for the entry */
  id: string;
  /** Degree or certification title */
  title: string;
  /** Educational institution name */
  organization: string;
  /** Date or date range (e.g., "2020 - 2024") */
  date: string;
  /** Description of the education */
  description: string;
  /** Optional highlights/achievements */
  highlights?: string[];
}

/**
 * Props for EducationSection component
 */
export interface EducationSectionProps {
  /** Array of education entries to display */
  entries: EducationEntry[];
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
export const DEFAULT_EDUCATION_TITLE = 'Education';

/**
 * Default section subtitle
 */
export const DEFAULT_EDUCATION_SUBTITLE = 'My academic journey and qualifications';

/**
 * EducationSection Component
 * 
 * Renders education entries in a timeline format with scroll-triggered animations.
 * Uses the mint green (#98FF98) and paperish white (#FFFEF2) color scheme.
 */
export function EducationSection({
  entries,
  title = DEFAULT_EDUCATION_TITLE,
  subtitle = DEFAULT_EDUCATION_SUBTITLE,
  className = '',
}: EducationSectionProps) {
  return (
    <section
      id="education"
      className={`education-section ${className}`.trim()}
      aria-label="Education section"
    >
      <div className="education-container">
        {/* Section Header */}
        <div className="education-header">
          <RevealWrapper
            direction="up"
            delay={0}
            duration={theme.animation.duration.normal}
          >
            <h2 className="education-title">{title}</h2>
          </RevealWrapper>

          {subtitle && (
            <RevealWrapper
              direction="up"
              delay={0.1}
              duration={theme.animation.duration.normal}
            >
              <p className="education-subtitle">{subtitle}</p>
            </RevealWrapper>
          )}
        </div>

        {/* Timeline */}
        <div className="education-timeline">
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              title={entry.title}
              organization={entry.organization}
              date={entry.date}
              description={entry.description}
              highlights={entry.highlights}
              index={index}
              icon={<GraduationIcon />}
            />
          ))}
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <RevealWrapper direction="fade" delay={0.2}>
            <p className="education-empty">No education entries to display.</p>
          </RevealWrapper>
        )}
      </div>
    </section>
  );
}

/**
 * Graduation cap icon for timeline markers
 */
function GraduationIcon() {
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
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

export default EducationSection;
