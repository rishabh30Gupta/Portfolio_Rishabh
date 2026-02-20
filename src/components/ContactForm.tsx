/**
 * ContactForm Component
 * 
 * A contact form with name, email, and message fields.
 * Includes client-side validation and submission handling.
 * 
 * Features:
 * - Form with name, email, and message fields
 * - Client-side validation
 * - Submit button with loading state
 * - Success/error feedback
 * - Styled with mint green accents
 * 
 * Requirements: 10.2, 10.3, 10.4
 */

import { useState, type FormEvent, type ChangeEvent } from 'react';
import './ContactForm.css';

/**
 * Form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Form validation errors
 */
export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Form submission status
 */
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Props for ContactForm component
 */
export interface ContactFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit?: (data: ContactFormData) => Promise<void>;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate form data and return errors
 */
export function validateForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required';
  }

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * ContactForm Component
 */
export function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validate single field on blur
    const fieldErrors = validateForm(formData);
    if (fieldErrors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof FormErrors],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, message: true });

    if (hasErrors(validationErrors)) {
      return;
    }

    setStatus('submitting');

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setStatus('success');
      // Reset form on success
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const getFieldClassName = (fieldName: keyof FormErrors) => {
    const baseClass = 'contact-form-input';
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} contact-form-input--error`;
    }
    return baseClass;
  };

  return (
    <form
      className={`contact-form ${className}`.trim()}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
    >
      {/* Success Message */}
      {status === 'success' && (
        <div className="contact-form-message contact-form-message--success" role="alert">
          <svg className="contact-form-message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>Thank you! Your message has been sent successfully.</span>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className="contact-form-message contact-form-message--error" role="alert">
          <svg className="contact-form-message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>Something went wrong. Please try again later.</span>
        </div>
      )}

      {/* Name Field */}
      <div className="contact-form-field">
        <label htmlFor="contact-name" className="contact-form-label">
          Name
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClassName('name')}
          placeholder="Your name"
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={status === 'submitting'}
        />
        {touched.name && errors.name && (
          <span id="name-error" className="contact-form-error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className="contact-form-field">
        <label htmlFor="contact-email" className="contact-form-label">
          Email
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClassName('email')}
          placeholder="your.email@example.com"
          aria-required="true"
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={status === 'submitting'}
        />
        {touched.email && errors.email && (
          <span id="email-error" className="contact-form-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className="contact-form-field">
        <label htmlFor="contact-message" className="contact-form-label">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${getFieldClassName('message')} contact-form-textarea`}
          placeholder="Your message..."
          rows={5}
          aria-required="true"
          aria-invalid={touched.message && !!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          disabled={status === 'submitting'}
        />
        {touched.message && errors.message && (
          <span id="message-error" className="contact-form-error" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="contact-form-submit"
        disabled={status === 'submitting'}
        aria-busy={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <span className="contact-form-spinner" aria-hidden="true" />
            <span>Sending...</span>
          </>
        ) : (
          <span>Send Message</span>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
