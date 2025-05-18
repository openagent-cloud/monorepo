import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Credential Store API (e2e)', () => {
  let app: INestApplication
  const validApiKey = 'test-api-key' // This would be a valid API key in a real scenario

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    // Mock the PrismaService to avoid actual database calls
    .overrideProvider('PrismaService')
    .useValue({
        tenant: {
          findUnique: jest.fn((args) => {
            // Return a tenant if the API key matches our valid key
            if (args.where && args.where.apiKey === validApiKey) {
              return Promise.resolve({ id: 'tenant-id', apiKey: validApiKey });
            }
            // Return null for invalid API keys
            return Promise.resolve(null);
          }),
        },
        credential: {
          findMany: jest.fn().mockResolvedValue([{ id: 'cred-id', service: 'openai', key: 'sk-test' }]),
          create: jest.fn().mockResolvedValue({ id: 'cred-id', service: 'openai' }),
          delete: jest.fn().mockResolvedValue({ id: 'cred-id' }),
        },
        tokenUsage: {
          findMany: jest.fn().mockResolvedValue([{
            id: 'usage-1',
            tenantId: 'tenant-id',
            service: 'openai',
            model: 'gpt-4',
            promptTokens: 100,
            completionTokens: 150,
            totalTokens: 250,
            createdAt: new Date(),
          }]),
          groupBy: jest.fn().mockResolvedValue([{
            _sum: {
              promptTokens: 200,
              completionTokens: 300,
              totalTokens: 500,
            },
            _count: { id: 10 },
            model: 'gpt-4'
          }]),
        },
      })
    .compile()

    app = moduleFixture.createNestApplication()
    
    // Apply the same pipes as in the main.ts file
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    
    // Enable CORS
    app.enableCors()
    
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Security Tests', () => {
    it('should require API key for protected endpoints', () => {
      return request(app.getHttpServer())
        .get('/credentials')
        .expect(401)
        .expect(res => {
          expect(res.body.message).toBe('API key is required')
        })
    })

    it('should reject invalid API keys', () => {
      return request(app.getHttpServer())
        .get('/credentials')
        .set('x-api-key', 'invalid-api-key')
        .expect(401)
    })
  })

  describe('Credential Endpoints', () => {
    it('should list credentials with valid API key', () => {
      return request(app.getHttpServer())
        .get('/credentials')
        .set('x-api-key', validApiKey)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true)
        })
    })

    it('should create a credential with valid API key and data', () => {
      return request(app.getHttpServer())
        .post('/credentials')
        .set('x-api-key', validApiKey)
        .send({
          service: 'openai',
          key: 'sk-test-key',
          metadata: { model: 'gpt-4' }
        })
        .expect(201)
    })

    it('should validate credential data', () => {
      return request(app.getHttpServer())
        .post('/credentials')
        .set('x-api-key', validApiKey)
        .send({
          // Missing required fields
        })
        .expect(400)
    })
  })

  describe('Analytics Endpoints', () => {
    it('should get token analytics with valid API key', () => {
      return request(app.getHttpServer())
        .get('/analytics/tokens')
        .set('x-api-key', validApiKey)
        .expect(200)
    })

    it('should accept days parameter', () => {
      return request(app.getHttpServer())
        .get('/analytics/tokens?days=60')
        .set('x-api-key', validApiKey)
        .expect(200)
    })
  })

  describe('Proxy Endpoints', () => {
    it('should validate proxy request data', () => {
      return request(app.getHttpServer())
        .post('/proxy/openai')
        .set('x-api-key', validApiKey)
        .send({
          // Missing required fields
        })
        .expect(400)
    })
  })
})
