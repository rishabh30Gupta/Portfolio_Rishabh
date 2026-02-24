/**
 * ProjectGallery Component
 * 
 * A section component that displays projects in a responsive grid layout
 * with scroll-based staggered reveal animations.
 * 
 * Features:
 * - Responsive grid/showcase layout for projects
 * - Scroll-based staggered reveal animations
 * - Each project reveals sequentially as user scrolls
 * 
 * Requirements: 6.1, 6.2, 6.5
 */

import { RevealWrapper } from './RevealWrapper';
import { ProjectCard } from './ProjectCard';
import './ProjectGallery.css';

/**
 * Project data interface
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

/**
 * Props for ProjectGallery component
 */
export interface ProjectGalleryProps {
  /** Array of projects to display */
  projects: Project[];
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * ProjectGallery Component
 * 
 * Displays projects in a responsive grid with scroll-triggered
 * staggered reveal animations.
 */
export function ProjectGallery({
  projects,
  title = 'Projects',
  subtitle = 'A showcase of my recent work and personal projects',
  className = '',
}: ProjectGalleryProps) {
  return (
    <section
      id="projects"
      className={`project-gallery ${className}`.trim()}
      aria-labelledby="projects-title"
    >
      <div className="project-gallery-container">
        {/* Section Header */}
        <RevealWrapper direction="up" duration={0.6}>
          <header className="project-gallery-header">
            <h2 id="projects-title" className="project-gallery-title">
              {title}
            </h2>
            <p className="project-gallery-subtitle">{subtitle}</p>
          </header>
        </RevealWrapper>

        {/* Projects Grid */}
        <div className="project-gallery-grid" role="list" aria-label="Project list">
          {projects.slice(0, 7).map((project, index) => (
            <div key={project.id} className="project-gallery-item" role="listitem">
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                link={project.liveUrl}
                githubUrl={project.githubUrl}
                index={index}
              />
            </div>
          ))}
          
          {/* More Projects Coming Soon Card */}
          {projects.length >= 7 && (
            <div className="project-gallery-item" role="listitem">
              <RevealWrapper direction="up" delay={0.7 * 0.15}>
                <div className="more-projects-card">
                  <div className="more-projects-icon">✨</div>
                  <h3 className="more-projects-title">More to come</h3>
                  <p className="more-projects-text">
                    Building new projects and exploring exciting ideas
                  </p>
                </div>
              </RevealWrapper>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectGallery;
