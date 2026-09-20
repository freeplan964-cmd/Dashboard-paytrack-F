/**
 * Password hashing using Node's built-in `crypto.scryptSync`.
 * Zero external dependencies. Timing-safe comparison via `timingSafeEqual`.
 *
 * Hash format: "<salt_hex>:<hash_hex>"
 * Salt: 16 random bytes (hex = 32 chars)
 * Hash: scrypt output, 64 bytes (hex = 128 chars)
 */

import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 }
const KEY_LENGTH = 64

export function hashPassword(plaintext: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(plaintext, salt, KEY_LENGTH, SCRYPT_PARAMS).toString('hex')
  return `${salt}:${hash}`
}

/**
 * Returns true if plaintext matches the stored hash.
 * Safe against timing attacks.
 */
export function verifyPassword(plaintext: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':')
    if (!salt || !hash) return false

    const derived = scryptSync(plaintext, salt, KEY_LENGTH, SCRYPT_PARAMS)
    const stored = Buffer.from(hash, 'hex')

    if (derived.length !== stored.length) return false
    return timingSafeEqual(derived, stored)
  } catch {
    return false
  }
}
