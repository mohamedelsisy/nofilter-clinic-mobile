/**
 * Saudi Phone Number Validation and Normalization
 * 
 * Accepts formats:
 * - 009665XXXXXXXX
 * - 9665XXXXXXXX
 * - +9665XXXXXXXX
 * - 05XXXXXXXX
 * 
 * Normalizes to: 05XXXXXXXX (10 digits starting with 05)
 */

/**
 * Validate if a phone number is a valid Saudi mobile number
 */
export const isValidSaudiPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Check various formats
  const patterns = [
    /^009665\d{8}$/,      // 009665XXXXXXXX
    /^9665\d{8}$/,        // 9665XXXXXXXX
    /^\+9665\d{8}$/,      // +9665XXXXXXXX
    /^05\d{8}$/,          // 05XXXXXXXX
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

/**
 * Normalize Saudi phone number to consistent format: 05XXXXXXXX
 */
export const normalizeSaudiPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove spaces, dashes, and other non-digit characters except + at start
  let cleaned = phone.trim().replace(/[\s-]/g, '');
  
  // Remove leading zeros or country code
  if (cleaned.startsWith('00966')) {
    // 009665XXXXXXXX -> 05XXXXXXXX
    cleaned = '0' + cleaned.substring(5);
  } else if (cleaned.startsWith('966')) {
    // 9665XXXXXXXX -> 05XXXXXXXX
    cleaned = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('+966')) {
    // +9665XXXXXXXX -> 05XXXXXXXX
    cleaned = '0' + cleaned.substring(4);
  }
  
  // Ensure it starts with 05
  if (!cleaned.startsWith('05')) {
    return phone; // Return original if can't normalize
  }
  
  return cleaned;
};

/**
 * Format phone number for display: 05X XXX XXXX
 */
export const formatSaudiPhone = (phone: string): string => {
  const normalized = normalizeSaudiPhone(phone);
  
  if (normalized.length !== 10) return phone;
  
  // Format as: 05X XXX XXXX
  return `${normalized.substring(0, 3)} ${normalized.substring(3, 6)} ${normalized.substring(6)}`;
};

/**
 * Get phone validation error message
 */
export const getPhoneValidationError = (phone: string, t: (key: string) => string): string | undefined => {
  if (!phone) {
    return t('phone_required');
  }
  
  if (!isValidSaudiPhone(phone)) {
    return t('phone_invalid_format');
  }
  
  return undefined;
};
