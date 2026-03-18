/**
 * Flaker - Deterministic in-repo fake data generator
 * Generates realistic-looking demo profile data without external dependencies
 */

// Simple seeded PRNG using mulberry32
class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

// Data pools
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Sam', 'Jamie', 'Drew', 'Blake', 'Cameron', 'Skyler', 'Reese', 'Parker',
  'Sage', 'River', 'Dakota', 'Phoenix', 'Rowan', 'Finley', 'Emerson', 'Hayden'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'
];

const EMAIL_DOMAINS = [
  'email.com', 'mail.com', 'inbox.com', 'webmail.com', 'post.com',
  'message.com', 'connect.com', 'online.com', 'net.com', 'digital.com'
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ALLERGIES = [
  'Penicillin', 'Peanuts', 'Tree nuts', 'Shellfish', 'Eggs', 'Milk',
  'Soy', 'Wheat', 'Fish', 'Latex', 'Sulfa drugs', 'Aspirin',
  'Ibuprofen', 'Bee stings', 'Pollen', 'Dust mites'
];

const RELATIONSHIPS = [
  'Spouse', 'Partner', 'Parent', 'Sibling', 'Child', 'Friend',
  'Relative', 'Guardian', 'Neighbor', 'Colleague'
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generator functions
export function generateName(rng: SeededRandom): string {
  const firstName = rng.pick(FIRST_NAMES);
  const lastName = rng.pick(LAST_NAMES);
  return `${firstName} ${lastName}`;
}

export function generateEmail(rng: SeededRandom, name: string): string {
  const namePart = name.toLowerCase().replace(/\s+/g, '.');
  const domain = rng.pick(EMAIL_DOMAINS);
  return `${namePart}@${domain}`;
}

export function generatePhone(rng: SeededRandom): string {
  const areaCode = rng.nextInt(200, 999);
  const exchange = rng.nextInt(200, 999);
  const number = rng.nextInt(1000, 9999);
  return `+1 (${areaCode}) ${exchange}-${number}`;
}

export function generateDateOfBirth(rng: SeededRandom): string {
  const month = rng.pick(MONTHS);
  const day = rng.nextInt(1, 28);
  const year = rng.nextInt(1950, 2005);
  return `${month} ${day}, ${year}`;
}

export function generateBloodType(rng: SeededRandom): string {
  return rng.pick(BLOOD_TYPES);
}

export function generateAllergies(rng: SeededRandom): string[] {
  const count = rng.nextInt(0, 4);
  if (count === 0) return [];
  
  const selected: string[] = [];
  const available = [...ALLERGIES];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = rng.nextInt(0, available.length - 1);
    selected.push(available[index]);
    available.splice(index, 1);
  }
  
  return selected;
}

export function generateEmergencyContact(rng: SeededRandom): {
  name: string;
  phone: string;
  relationship: string;
} {
  return {
    name: generateName(rng),
    phone: generatePhone(rng),
    relationship: rng.pick(RELATIONSHIPS),
  };
}

// Main profile generator
export interface UserProfile {
  name: string;
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

export function generateUserProfile(seed: number = 42): UserProfile {
  const rng = new SeededRandom(seed);
  
  const name = generateName(rng);
  const email = generateEmail(rng, name);
  const phone = generatePhone(rng);
  const dateOfBirth = generateDateOfBirth(rng);
  const bloodType = generateBloodType(rng);
  const allergies = generateAllergies(rng);
  const emergencyContact = generateEmergencyContact(rng);
  
  return {
    name,
    email,
    phone,
    dateOfBirth,
    bloodType,
    allergies,
    emergencyContact,
  };
}
