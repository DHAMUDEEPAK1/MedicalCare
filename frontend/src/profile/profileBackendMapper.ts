import type { UserProfile, EmergencyContact } from '../backend';
import { BloodType } from '../backend';
import type { ProfileDetails } from './profileTypes';

/**
 * Maps backend UserProfile to frontend ProfileDetails
 */
export function backendToFrontend(backendProfile: UserProfile): ProfileDetails {
  return {
    fullName: backendProfile.name || '',
    email: backendProfile.email || '',
    phone: '', // Backend doesn't store phone for II users
    dateOfBirth: backendProfile.dateOfBirth ? bigintToDateString(backendProfile.dateOfBirth) : '',
    bloodType: backendProfile.bloodType ? bloodTypeToString(backendProfile.bloodType) : '',
    allergies: backendProfile.allergies.map(a => a.name),
    emergencyContact: {
      name: backendProfile.emergencyContact?.name || '',
      phone: backendProfile.emergencyContact?.phone || '',
      relationship: backendProfile.emergencyContact?.relationship || '',
    },
    location: backendProfile.location || '',
  };
}

/**
 * Maps frontend ProfileDetails to backend UserProfile
 */
export function frontendToBackend(profile: ProfileDetails): UserProfile {
  return {
    name: profile.fullName,
    email: profile.email || undefined,
    location: profile.location || undefined,
    company: undefined,
    website: undefined,
    bio: undefined,
    image: undefined,
    dateOfBirth: profile.dateOfBirth ? dateStringToBigint(profile.dateOfBirth) : undefined,
    bloodType: profile.bloodType ? stringToBloodType(profile.bloodType) : undefined,
    allergies: profile.allergies.map(name => ({
      name,
      severity: 'Unknown',
      reaction: '',
    })),
    emergencyContact: profile.emergencyContact.name || profile.emergencyContact.phone || profile.emergencyContact.relationship
      ? {
          name: profile.emergencyContact.name,
          phone: profile.emergencyContact.phone,
          relationship: profile.emergencyContact.relationship,
        }
      : undefined,
  };
}

/**
 * Converts backend BloodType enum to display string
 */
function bloodTypeToString(bloodType: BloodType): string {
  switch (bloodType) {
    case BloodType.aPositive:
      return 'A+';
    case BloodType.aNegative:
      return 'A-';
    case BloodType.bPositive:
      return 'B+';
    case BloodType.bNegative:
      return 'B-';
    case BloodType.abPositive:
      return 'AB+';
    case BloodType.abNegative:
      return 'AB-';
    case BloodType.oPositive:
      return 'O+';
    case BloodType.oNegative:
      return 'O-';
    default:
      return '';
  }
}

/**
 * Converts display string to backend BloodType enum
 */
function stringToBloodType(bloodType: string): BloodType {
  switch (bloodType) {
    case 'A+':
      return BloodType.aPositive;
    case 'A-':
      return BloodType.aNegative;
    case 'B+':
      return BloodType.bPositive;
    case 'B-':
      return BloodType.bNegative;
    case 'AB+':
      return BloodType.abPositive;
    case 'AB-':
      return BloodType.abNegative;
    case 'O+':
      return BloodType.oPositive;
    case 'O-':
      return BloodType.oNegative;
    default:
      return BloodType.oPositive; // Safe default
  }
}

/**
 * Converts bigint timestamp (nanoseconds) to YYYY-MM-DD string
 */
function bigintToDateString(timestamp: bigint): string {
  try {
    // Convert nanoseconds to milliseconds
    const ms = Number(timestamp / 1000000n);
    const date = new Date(ms);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

/**
 * Converts YYYY-MM-DD string to bigint timestamp (nanoseconds)
 */
function dateStringToBigint(dateString: string): bigint {
  try {
    const date = new Date(dateString);
    const ms = date.getTime();
    // Convert milliseconds to nanoseconds
    return BigInt(ms) * 1000000n;
  } catch {
    return 0n;
  }
}
