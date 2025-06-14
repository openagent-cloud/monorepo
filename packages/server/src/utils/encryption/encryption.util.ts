import * as crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

/**
 * Encrypts a string value using AES-256-GCM
 * @param value The string to encrypt
 * @param key The encryption key
 * @returns JSON string containing the encrypted data, IV, and auth tag
 */
export function encrypt(value: string, key: Buffer): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()])
  const authTag = cipher.getAuthTag()

  return JSON.stringify({
    iv: iv.toString('hex'),
    encrypted: encrypted.toString('hex'),
    authTag: authTag.toString('hex')
  })
}

/**
 * Decrypts an encrypted string
 * @param text The encrypted text (hex encoded)
 * @param ivHex The initialization vector (hex encoded)
 * @param authTag The authentication tag (hex encoded)
 * @param key The encryption key
 * @returns The decrypted string
 */
export function decrypt(text: string, ivHex: string, authTag: string, key: Buffer): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(authTag, 'hex'))
  const decrypted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()])
  return decrypted.toString()
}

/**
 * Helper function to safely decrypt API credentials
 * Handles both plain API keys and encrypted keys
 */
export function safeDecrypt(encryptedKey: string, encryptionKey: Buffer): string {
  // If already a plain API key (starts with sk-), return as is
  if (encryptedKey.startsWith('sk-')) {
    return encryptedKey
  }

  try {
    // Try to parse as JSON
    const parsedKey = JSON.parse(encryptedKey)

    // Check if parsed result is itself a plain API key
    if (typeof parsedKey === 'string' && parsedKey.startsWith('sk-')) {
      return parsedKey
    }

    // Standard encrypted format with iv, authTag, encrypted
    const { iv, authTag, encrypted } = parsedKey
    return decrypt(encrypted, iv, authTag, encryptionKey)
  } catch (error) {
    // Last resort - if JSON parsing fails but it's still a valid key somehow
    if (encryptedKey.startsWith('sk-')) {
      return encryptedKey
    }
    // Can't decrypt
    throw new Error(`Failed to decrypt API key: ${error.message}`)
  }
}
