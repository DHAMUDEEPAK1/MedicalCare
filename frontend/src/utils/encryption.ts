/**
 * Encryption Utility for End-to-End Encryption (E2EE)
 * Uses Web Crypto API for secure AES-GCM encryption/decryption
 */

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12; // Standard for AES-GCM

/**
 * Derives a symmetric key from the user's principal.
 */
async function deriveKey(userPrincipal: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(userPrincipal),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode('MedicalCare-E2EE-Salt-2026'),
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: ALGORITHM, length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypts a Uint8Array using the user's principal as the key base.
 */
export async function encryptData(data: Uint8Array, userPrincipal: string): Promise<Uint8Array> {
    const key = await deriveKey(userPrincipal);
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encrypted = await window.crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        data.buffer // Use .buffer to satisfy BufferSource type
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return combined;
}

/**
 * Decrypts a Uint8Array using the user's principal as the key base.
 */
export async function decryptData(encryptedData: Uint8Array, userPrincipal: string): Promise<Uint8Array> {
    const key = await deriveKey(userPrincipal);

    const iv = encryptedData.slice(0, IV_LENGTH);
    const data = encryptedData.slice(IV_LENGTH);

    try {
        const decrypted = await window.crypto.subtle.decrypt(
            { name: ALGORITHM, iv },
            key,
            data.buffer // Use .buffer to satisfy BufferSource type
        );
        return new Uint8Array(decrypted);
    } catch (error) {
        console.error('Decryption failed. This might happen if the file was not encrypted or the key is wrong.', error);
        throw new Error('E2EE Decryption failed');
    }
}
