import { Injectable } from '@nestjs/common'
import * as elliptic from 'elliptic'
import * as crypto from 'crypto'

@Injectable()
export class CryptoService {
  private ec = new elliptic.ec('secp256k1')

  /**
   * Generate a new secp256k1 key pair
   * @returns Object containing public and private keys as hex strings
   */
  generateKeyPair(): { publicKey: string; privateKey: string } {
    const keypair = this.ec.genKeyPair()
    const publicKey = keypair.getPublic('hex')
    const privateKey = keypair.getPrivate('hex')
    return { publicKey, privateKey }
  }

  /**
   * Encrypt a message for a recipient using their public key
   * @param message - The message to encrypt
   * @param recipientPublicKey - The recipient's public key as a hex string
   * @returns Encrypted message as a hex string
   */
  encrypt(message: string, recipientPublicKey: string): string {
    // Use a random symmetric key for actual encryption
    const symmetricKey = crypto.randomBytes(32)

    // Encrypt the message with the symmetric key
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv)
    let encrypted = cipher.update(message, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Encrypt the symmetric key with the recipient's public key
    const recipientKey = this.ec.keyFromPublic(recipientPublicKey, 'hex')

    // Use ECDH for key agreement (our ephemeral private key + their public key)
    const ephemeralKeypair = this.ec.genKeyPair()
    const ephemeralPublicKey = ephemeralKeypair.getPublic('hex')

    // Derive shared secret
    const sharedSecret = ephemeralKeypair.derive(recipientKey.getPublic())
    // Convert shared secret to hex string with padding to ensure correct length
    const sharedSecretHex = sharedSecret.toString(16, 64).padStart(64, '0')
    const sharedSecretBuffer = Buffer.from(sharedSecretHex, 'hex')

    // Encrypt the symmetric key with the shared secret
    const keyCipher = crypto.createCipheriv('aes-256-cbc', sharedSecretBuffer.slice(0, 32), iv)
    let encryptedKey = keyCipher.update(symmetricKey, undefined, 'hex')
    encryptedKey += keyCipher.final('hex')

    // Combine all parts: ephemeral public key + IV + encrypted key + encrypted message
    const result = {
      epk: ephemeralPublicKey,
      iv: iv.toString('hex'),
      encryptedKey,
      encryptedMessage: encrypted
    }

    return JSON.stringify(result)
  }

  /**
   * Decrypt a message using the recipient's private key
   * @param encryptedData - The encrypted message as a hex string
   * @param privateKey - The recipient's private key as a hex string
   * @returns Decrypted message as a string
   */
  decrypt(encryptedData: string, privateKey: string): string {
    const { epk, iv, encryptedKey, encryptedMessage } = JSON.parse(encryptedData)

    // Recreate key objects
    const recipientKeypair = this.ec.keyFromPrivate(privateKey, 'hex')
    const ephemeralPublicKey = this.ec.keyFromPublic(epk, 'hex').getPublic()

    // Derive shared secret (their ephemeral public key + our private key)
    const sharedSecret = recipientKeypair.derive(ephemeralPublicKey)
    const sharedSecretBuffer = Buffer.from(sharedSecret.toString(16, 64), 'hex')

    // Decrypt the symmetric key
    const ivBuffer = Buffer.from(iv, 'hex')
    const keyDecipher = crypto.createDecipheriv(
      'aes-256-cbc',
      sharedSecretBuffer.slice(0, 32),
      ivBuffer
    )
    let decryptedKey = keyDecipher.update(Buffer.from(encryptedKey, 'hex'))
    decryptedKey = Buffer.concat([decryptedKey, keyDecipher.final()])

    // Decrypt the message with the symmetric key
    const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedKey, ivBuffer)
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

  /**
   * Sign a message with a private key
   * @param message - The message to sign
   * @param privateKey - The signer's private key as a hex string
   * @returns Signature as a hex string
   */
  sign(message: string, privateKey: string): string {
    const keypair = this.ec.keyFromPrivate(privateKey, 'hex')
    const msgHash = crypto.createHash('sha256').update(message).digest()
    const signature = keypair.sign(msgHash)
    return signature.toDER('hex')
  }

  /**
   * Verify a signature with the signer's public key
   * @param message - The original message
   * @param signature - The signature as a hex string
   * @param publicKey - The signer's public key as a hex string
   * @returns Boolean indicating if the signature is valid
   */
  verify(message: string, signature: string, publicKey: string): boolean {
    try {
      const key = this.ec.keyFromPublic(publicKey, 'hex')
      const msgHash = crypto.createHash('sha256').update(message).digest()
      return key.verify(msgHash, signature)
    } catch {
      // Any error during verification means invalid signature
      return false
    }
  }
}
