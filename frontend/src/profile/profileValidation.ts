import type { ProfileDetails } from './profileTypes';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates profile details and returns human-readable error messages
 */
export function validateProfileDetails(profile: ProfileDetails): ValidationResult {
  const errors: Record<string, string> = {};

  // Full name is required
  if (!profile.fullName || profile.fullName.trim().length === 0) {
    errors.fullName = 'Full name is required';
  } else if (profile.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  // Email format validation (if provided)
  if (profile.email && profile.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Phone validation (if provided)
  if (profile.phone && profile.phone.trim().length > 0) {
    // Remove common formatting characters
    const cleanPhone = profile.phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      errors.phone = 'Phone number should be between 10 and 15 digits';
    }
    if (!/^\+?[\d]+$/.test(cleanPhone)) {
      errors.phone = 'Phone number should only contain digits and optional + prefix';
    }
  }

  // Emergency contact validation (if any field is filled, all should be filled)
  const hasEmergencyData =
    profile.emergencyContact.name ||
    profile.emergencyContact.phone ||
    profile.emergencyContact.relationship;

  if (hasEmergencyData) {
    if (!profile.emergencyContact.name || profile.emergencyContact.name.trim().length === 0) {
      errors.emergencyContactName = 'Emergency contact name is required';
    }
    if (!profile.emergencyContact.phone || profile.emergencyContact.phone.trim().length === 0) {
      errors.emergencyContactPhone = 'Emergency contact phone is required';
    } else {
      const cleanPhone = profile.emergencyContact.phone.replace(/[\s\-\(\)]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        errors.emergencyContactPhone = 'Phone number should be between 10 and 15 digits';
      }
    }
    if (!profile.emergencyContact.relationship || profile.emergencyContact.relationship.trim().length === 0) {
      errors.emergencyContactRelationship = 'Emergency contact relationship is required';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
