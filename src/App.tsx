/**
 * Main App Component
 * 
 * Wires all portfolio components together including:
 * - AnimationProvider for global animation state
 * - Navbar for navigation
 * - All section components
 * 
 * Requirements: All
 */

import { AnimationProvider } from './context/AnimationContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EducationSection } from './components/EducationSection';
import { ExperienceSection } from './components/ExperienceSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ProjectGallery } from './components/ProjectGallery';
import { ContactSection } from './components/ContactSection';
import { portfolioData } from './data/portfolioData';
import './App.css';

function App() {
  return (
    <AnimationProvider initialSection="hero">
      <div className="app">
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Navigation */}
        <Navbar />

        {/* Main content area */}
        <main id="main-content" className="scroll-container">
          {/* Hero Section */}
          <HeroSection
            profileImage={portfolioData.hero.profileImage}
            introText={portfolioData.hero.introText}
            name={portfolioData.hero.name}
            subtitle={portfolioData.hero.title}
          />

          {/* Education Section */}
          <EducationSection
            entries={portfolioData.education}
            title="Education"
            subtitle="My academic journey and qualifications"
          />

          {/* Experience Section */}
          <ExperienceSection
            entries={portfolioData.experience}
            title="Experience"
            subtitle="My professional journey and work history"
          />

          {/* Achievements Section */}
          <AchievementsSection
            entries={portfolioData.achievements}
            title="Achievements"
            subtitle="Proof of work."
          />

          {/* Projects Section */}
          <ProjectGallery
            projects={portfolioData.projects}
            title="Projects"
            subtitle="Things I've built — from ideas to live products."
          />

          {/* Contact Section + Footer */}
          <ContactSection
            email={portfolioData.contact.email}
            socialLinks={portfolioData.contact.socialLinks}
          />
        </main>
      </div>
    </AnimationProvider>
  );
}

export default App;
