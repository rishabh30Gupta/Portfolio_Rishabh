/**
 * ContactSection Component
 * 
 * The contact section displaying contact information, social links,
 * and the contact form with entrance animations.
 * 
 * Features:
 * - Display contact info (email, social links)
 * - Integrate ContactForm component
 * - Apply entrance animations
 * 
 * Requirements: 10.1, 10.5
 */

import { RevealWrapper } from './RevealWrapper';
import './ContactSection.css';

/**
 * Props for ContactSection component
 */
export interface ContactSectionProps {
  /** Email address */
  email?: string;
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * ContactSection Component
 */
export function ContactSection({
  email,
  title = 'Let\'s Connect',
  subtitle = "Find me on social media or drop me an email — always open to interesting conversations about AI, tech, and new ideas.",
  className = '',
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      className={`contact-section ${className}`.trim()}
      aria-labelledby="contact-title"
    >
      <div className="contact-section-container">
        {/* Section Header */}
        <RevealWrapper direction="up" duration={0.6}>
          <header className="contact-section-header">
            <h2 id="contact-title" className="contact-section-title">
              {title}
            </h2>
            <p className="contact-section-subtitle">{subtitle}</p>
          </header>
        </RevealWrapper>

        <div className="contact-section-content">
          {/* Gmail Contact */}
          <div className="contact-info">
            {email && (
              <a href={`mailto:${email}`} className="contact-email-card">
                <img 
                  src="https://img.icons8.com/color/96/gmail-new.png" 
                  alt="Gmail"
                  className="contact-gmail-icon"
                />
                <span className="contact-email-text">{email}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
