/**
 * TypeScript types for locally persisted demo accounts and verification results
 * used by Sign In/Sign Up with phone + password authentication.
 */

export interface DemoAccount {
  fullName: string;
  phoneNumber: string;
  passwordHash: string; // Simple hash for demo purposes
  createdAt: number;
}

export interface VerifyCredentialsResult {
  success: boolean;
  error?: string;
  account?: DemoAccount;
}

export interface CreateAccountResult {
  success: boolean;
  error?: string;
  account?: DemoAccount;
}
