import { Test, TestingModule } from '@nestjs/testing'
import { CryptoService } from './crypto.service'

describe('CryptoService', () => {
  let service: CryptoService

  beforeEach(async () => {
    // Create a test module
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService]
    }).compile()

    service = module.get<CryptoService>(CryptoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateKeyPair', () => {
    it('should generate a valid key pair', () => {
      const result = service.generateKeyPair()
      
      // Verify the structure of the result
      expect(result).toHaveProperty('publicKey')
      expect(result).toHaveProperty('privateKey')
      expect(typeof result.publicKey).toBe('string')
      expect(typeof result.privateKey).toBe('string')
      expect(result.publicKey.length).toBeGreaterThan(50) // secp256k1 keys are reasonably long
      expect(result.privateKey.length).toBeGreaterThan(0)
    })
  })

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt a message correctly', () => {
      const originalMessage = 'This is a secret message'
      
      // First generate a key pair
      const { publicKey, privateKey } = service.generateKeyPair()
      
      // Encrypt the message with the public key
      const encrypted = service.encrypt(originalMessage, publicKey)
      expect(encrypted).toBeTruthy()
      
      // Decrypt with the corresponding private key
      const decrypted = service.decrypt(encrypted, privateKey)
      
      // The decrypted message should match the original
      expect(decrypted).toBe(originalMessage)
    })
    
    it('should handle empty messages', () => {
      const emptyMessage = ''
      const { publicKey, privateKey } = service.generateKeyPair()
      
      const encrypted = service.encrypt(emptyMessage, publicKey)
      const decrypted = service.decrypt(encrypted, privateKey)
      
      expect(decrypted).toBe(emptyMessage)
    })
    
    it('should throw on invalid encrypted data', () => {
      const { privateKey } = service.generateKeyPair()
      
      expect(() => {
        service.decrypt('{invalid-json', privateKey)
      }).toThrow()
    })
  })

  describe('sign and verify', () => {
    it('should verify a correctly signed message', () => {
      const message = 'Message to sign and verify'
      
      // Generate a key pair for signing
      const { publicKey, privateKey } = service.generateKeyPair()
      
      // Sign the message
      const signature = service.sign(message, privateKey)
      expect(signature).toBeTruthy()
      
      // Verify with the correct public key
      const isValid = service.verify(message, signature, publicKey)
      expect(isValid).toBe(true)
    })
    
    it('should reject verification with wrong public key', () => {
      const message = 'Message to sign and verify'
      
      // Generate two separate key pairs
      const signer = service.generateKeyPair()
      const otherKeys = service.generateKeyPair()
      
      // Sign with first key
      const signature = service.sign(message, signer.privateKey)
      
      // Verify with the wrong public key
      const isValid = service.verify(message, signature, otherKeys.publicKey)
      expect(isValid).toBe(false)
    })
    
    it('should reject verification with tampered message', () => {
      const originalMessage = 'Original message'
      const tamperedMessage = 'Tampered message'
      
      const { publicKey, privateKey } = service.generateKeyPair()
      const signature = service.sign(originalMessage, privateKey)
      
      // Try to verify a different message with the same signature
      const isValid = service.verify(tamperedMessage, signature, publicKey)
      expect(isValid).toBe(false)
    })
  })
})
