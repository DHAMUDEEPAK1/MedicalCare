export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  availability: string;
  image: string;
  experience: string;
}


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

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 127,
    availability: 'Available Today',
    image: '👩‍⚕️',
    experience: '15 years',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Pediatrician',
    rating: 4.8,
    reviews: 203,
    availability: 'Available Tomorrow',
    image: '👨‍⚕️',
    experience: '12 years',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    rating: 4.9,
    reviews: 156,
    availability: 'Available Today',
    image: '👩‍⚕️',
    experience: '10 years',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgeon',
    rating: 4.7,
    reviews: 89,
    availability: 'Next Week',
    image: '👨‍⚕️',
    experience: '18 years',
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    specialty: 'General Practitioner',
    rating: 4.8,
    reviews: 245,
    availability: 'Available Today',
    image: '👩‍⚕️',
    experience: '8 years',
  },
];


export const MOCK_USER: UserProfile = {
  name: 'Alex Thompson',
  email: 'alex.thompson@email.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: 'January 15, 1990',
  bloodType: 'O+',
  allergies: ['Penicillin', 'Peanuts'],
  emergencyContact: {
    name: 'Jamie Thompson',
    phone: '+1 (555) 987-6543',
    relationship: 'Spouse',
  },
};
