/**
 * ContactSection Component
 * 
 * Combined contact + footer section with social links,
 * email, and copyright info.
 */

import { RevealWrapper } from './RevealWrapper';
import './ContactSection.css';

export interface ContactSectionProps {
  email?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  title?: string;
  subtitle?: string;
  className?: string;
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function getIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return <GitHubIcon />;
  if (p.includes('linkedin')) return <LinkedInIcon />;
  return null;
}

export function ContactSection({
  email,
  socialLinks = [],
  title = "Let's Connect",
  subtitle = "Open to interesting conversations about DevOps, cloud, and new ideas.",
  className = '',
}: ContactSectionProps) {
  const year = new Date().getFullYear();

  return (
    <section
      id="contact"
      className={`contact-section ${className}`.trim()}
      aria-labelledby="contact-title"
    >
      {/* Main Contact Area */}
      <div className="contact-main">
        <div className="contact-container">
          <RevealWrapper direction="up" duration={0.6}>
            <header className="contact-header">
              <h2 id="contact-title" className="contact-title">{title}</h2>
              <p className="contact-subtitle">{subtitle}</p>
            </header>
          </RevealWrapper>

          <RevealWrapper direction="up" duration={0.6} delay={0.2}>
            <div className="contact-cards">
              {/* Email Card */}
              {email && (
                <a href={`mailto:${email}`} className="contact-card">
                  <div className="contact-card-icon">
                    <EmailIcon />
                  </div>
                  <div className="contact-card-info">
                    <span className="contact-card-label">Email</span>
                    <span className="contact-card-value">{email}</span>
                  </div>
                </a>
              )}

              {/* Phone Card */}
              <a href="tel:+918359834412" className="contact-card">
                <div className="contact-card-icon">
                  <PhoneIcon />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">Phone</span>
                  <span className="contact-card-value">+91 8359834412</span>
                </div>
              </a>
            </div>
          </RevealWrapper>

          {/* Social Links */}
          <RevealWrapper direction="up" duration={0.6} delay={0.3}>
            <div className="contact-socials">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-btn"
                  aria-label={`Visit my ${link.platform} profile`}
                >
                  {getIcon(link.platform)}
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </RevealWrapper>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="contact-container">
          <div className="footer-content">
            <div className="footer-brand">
              <svg className="footer-logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M392.8 65.2C375.8 60.3 358.1 70.2 353.2 87.2L225.2 535.2C220.3 552.2 230.2 569.9 247.2 574.8C264.2 579.7 281.9 569.8 286.8 552.8L414.8 104.8C419.7 87.8 409.8 70.1 392.8 65.2zM457.4 201.3C444.9 213.8 444.9 234.1 457.4 246.6L530.8 320L457.4 393.4C444.9 405.9 444.9 426.2 457.4 438.7C469.9 451.2 490.2 451.2 502.7 438.7L598.7 342.7C611.2 330.2 611.2 309.9 598.7 297.4L502.7 201.4C490.2 188.9 469.9 188.9 457.4 201.4zM182.7 201.3C170.2 188.8 149.9 188.8 137.4 201.3L41.4 297.3C28.9 309.8 28.9 330.1 41.4 342.6L137.4 438.6C149.9 451.1 170.2 451.1 182.7 438.6C195.2 426.1 195.2 405.8 182.7 393.3L109.3 320L182.6 246.6C195.1 234.1 195.1 213.8 182.6 201.3z"/>
              </svg>
              <span className="footer-brand-name">RishRealm</span>
            </div>
            <p className="footer-copy">&copy; {year} Rishabh Gupta. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default ContactSection;
