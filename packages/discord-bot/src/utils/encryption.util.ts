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
    authTag: authTag.toString('hex'),
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
