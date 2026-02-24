/**
 * ProjectCard Component
 * 
 * A reusable card component for displaying projects with hover animations
 * and scroll-triggered entrance animations using RevealWrapper.
 * 
 * Features:
 * - Display project image, title, description, and tags
 * - Hover effects with smooth transforms (scale, shadow)
 * - Optional links to live demo and GitHub
 * - Scroll-triggered entrance animation via RevealWrapper
 * 
 * Requirements: 6.1, 6.3, 6.4
 */

import { type ReactNode } from 'react';
import { RevealWrapper } from './RevealWrapper';
import { theme } from '../theme/theme';
import './ProjectCard.css';

/**
 * Props for ProjectCard component
 */
export interface ProjectCardProps {
  /** Unique identifier for the project */
  id: string;
  /** Title of the project */
  title: string;
  /** Description of the project */
  description: string;
  /** URL of the project image */
  image: string;
  /** Array of technology/skill tags */
  tags: string[];
  /** Optional URL to live demo */
  link?: string;
  /** Optional URL to GitHub repository */
  githubUrl?: string;
  /** Index for staggered animations (0-based) */
  index: number;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Calculate stagger delay based on index
 * Each card is delayed by a consistent amount multiplied by its index
 */
export function calculateStaggerDelay(index: number, baseDelay: number = 0.15): number {
  return index * baseDelay;
}

/**
 * External link icon component
 */
function ExternalLinkIcon(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/**
 * GitHub icon component
 */
function GitHubIcon(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

/**
 * ProjectCard Component
 * 
 * Displays a single project with scroll-triggered entrance animations
 * and hover effects. Uses RevealWrapper for entrance animations.
 */
export function ProjectCard({
  id,
  title,
  description,
  image,
  tags,
  link,
  githubUrl,
  index,
  className = '',
}: ProjectCardProps) {
  const staggerDelay = calculateStaggerDelay(index);
  const hasLinks = link || githubUrl;

  return (
    <RevealWrapper
      direction="up"
      delay={staggerDelay}
      duration={theme.animation.duration.normal}
      distance={40}
    >
      <article
        className={`project-card ${className}`.trim()}
        data-index={index}
        data-project-id={id}
      >
        {/* Image section */}
        <div className="project-card-image-container">
          <img
            src={image}
            alt={`Screenshot of ${title} project`}
            className="project-card-image"
            loading="lazy"
          />
          <div className="project-card-image-overlay" />
        </div>

        {/* Content section */}
        <div className="project-card-content">
          {/* Title */}
          <h3 className="project-card-title">{title}</h3>

          {/* Description */}
          <p className="project-card-description">{description}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="project-card-tags" role="list" aria-label="Project technologies">
              {tags.map((tag, tagIndex) => (
                <span
                  key={`${id}-tag-${tagIndex}`}
                  className="project-card-tag"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          {hasLinks && (
            <div className="project-card-links">
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link project-card-link--demo"
                  aria-label={`View live demo of ${title}`}
                >
                  <ExternalLinkIcon />
                  <span>Live Demo</span>
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link project-card-link--github"
                  aria-label={`View ${title} source code on GitHub`}
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </RevealWrapper>
  );
}

export default ProjectCard;
