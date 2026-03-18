/**
 * Frontend type for editable profile details.
 * Extends beyond the backend UserProfile to include all health-related fields.
 */
export interface ProfileDetails {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

/**
 * Returns an empty ProfileDetails object with default values
 */
export function getEmptyProfileDetails(): ProfileDetails {
  return {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  };
}

/**
 * Checks if a ProfileDetails object has any saved values
 */
export function hasProfileData(profile: ProfileDetails | null): boolean {
  if (!profile) return false;
  return !!(
    profile.fullName ||
    profile.email ||
    profile.phone ||
    profile.dateOfBirth ||
    profile.bloodType ||
    profile.allergies.length > 0 ||
    profile.emergencyContact.name ||
    profile.emergencyContact.phone ||
    profile.emergencyContact.relationship
  );
}
