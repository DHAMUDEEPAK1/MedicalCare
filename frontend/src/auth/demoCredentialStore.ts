/**
 * Local demo account persistence and verification using localStorage.
 * Implements create account with fullName + phoneNumber + password-derived value,
 * enforces phone-number uniqueness, and provides verifyCredentials for UI.
 */

import type { DemoAccount, VerifyCredentialsResult, CreateAccountResult } from './demoCredentialTypes';

const ACCOUNTS_KEY = 'healthcare_demo_accounts';

/**
 * Simple hash function for demo purposes (NOT for production use)
 */
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Load all accounts from localStorage
 */
function loadAccounts(): Record<string, DemoAccount> {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load accounts:', error);
    return {};
  }
}

/**
 * Save accounts to localStorage
 */
function saveAccounts(accounts: Record<string, DemoAccount>): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Failed to save accounts:', error);
  }
}

/**
 * Create a new account with fullName, phoneNumber, and password
 * Enforces phone number uniqueness
 */
export function createAccount(
  fullName: string,
  phoneNumber: string,
  password: string
): CreateAccountResult {
  // Validation
  if (!fullName || fullName.trim().length < 2) {
    return {
      success: false,
      error: 'Please enter your full name (at least 2 characters).',
    };
  }

  if (!phoneNumber || phoneNumber.length < 10) {
    return {
      success: false,
      error: 'Please enter a valid phone number.',
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.',
    };
  }

  const accounts = loadAccounts();

  // Check if phone number already exists
  if (accounts[phoneNumber]) {
    return {
      success: false,
      error: 'An account with this phone number already exists. Please sign in instead.',
    };
  }

  // Create new account
  const account: DemoAccount = {
    fullName: fullName.trim(),
    phoneNumber,
    passwordHash: simpleHash(password),
    createdAt: Date.now(),
  };

  accounts[phoneNumber] = account;
  saveAccounts(accounts);

  return {
    success: true,
    account,
  };
}

/**
 * Verify credentials (phone number + password)
 */
export function verifyCredentials(
  phoneNumber: string,
  password: string
): VerifyCredentialsResult {
  if (!phoneNumber || !password) {
    return {
      success: false,
      error: 'Please enter both phone number and password.',
    };
  }

  const accounts = loadAccounts();
  const account = accounts[phoneNumber];

  if (!account) {
    return {
      success: false,
      error: 'No account found with this phone number.',
    };
  }

  const passwordHash = simpleHash(password);
  if (account.passwordHash !== passwordHash) {
    return {
      success: false,
      error: 'Incorrect password. Please try again.',
    };
  }

  return {
    success: true,
    account,
  };
}

/**
 * Get account by phone number (for profile display, etc.)
 */
export function getAccount(phoneNumber: string): DemoAccount | null {
  const accounts = loadAccounts();
  return accounts[phoneNumber] || null;
}
