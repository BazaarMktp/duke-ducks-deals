import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Unsanitized HTML string
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
};

/**
 * Sanitize plain text input (removes HTML tags completely)
 * @param input - User input string
 * @returns Plain text string with HTML stripped
 */
export const sanitizeText = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

/**
 * Validate and sanitize email input
 * @param email - Email string to validate
 * @returns Sanitized email or null if invalid
 */
export const validateEmail = (email: string): string | null => {
  const sanitized = sanitizeText(email.trim().toLowerCase());
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return emailRegex.test(sanitized) ? sanitized : null;
};

/**
 * Validate and sanitize numeric input
 * @param input - Numeric string
 * @returns Number or null if invalid
 */
export const validateNumber = (input: string): number | null => {
  const sanitized = sanitizeText(input.trim());
  const num = parseFloat(sanitized);
  return isNaN(num) ? null : num;
};

/**
 * Validate string length
 * @param input - String to validate
 * @param maxLength - Maximum allowed length
 * @returns true if valid, false otherwise
 */
export const validateLength = (input: string, maxLength: number): boolean => {
  return input.length <= maxLength;
};

/**
 * Sanitize URL input
 * @param url - URL string to sanitize
 * @returns Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url: string): string | null => {
  try {
    const sanitized = sanitizeText(url.trim());
    const urlObj = new URL(sanitized);
    
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return null;
    }
    
    return urlObj.href;
  } catch {
    return null;
  }
};
