import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { validateEnv } from './utils/config/env.schema'
import { ConfigService } from './utils/config/config.service'
import { LoggerService, GlobalExceptionFilter, setupLogsDirectory } from './utils/logger'

declare const module: any

async function bootstrap() {
  // Set up logs directory first to ensure it exists
  setupLogsDirectory()

  // Validate environment variables before app initialization
  // This will exit the process if any required variables are missing or invalid
  validateEnv()

  // Create the NestJS application with our custom logger
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.port
  const env = configService.nodeEnv

  // Dynamic CORS origins based on environment
  const allowedOriginsDev = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000' // Alternative dev server
  ]
  const allowedOriginsProd = [
    'https://openagent.cloud', // Production domain
    'https://www.openagent.cloud', // Production with www
    'https://app.openagent.cloud' // Production instance
  ]

  // const allowedOrigins = env === 'development' ? allowedOriginsDev : allowedOriginsProd
  const allowedOrigins = [...allowedOriginsDev, ...allowedOriginsProd] //Temporry for testing

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })

  // Get our custom logger service and set the context
  // Use resolve() instead of get() for scoped providers
  const logger = await app.resolve(LoggerService)
  logger.setContext('Bootstrap')
  logger.log('Environment variables validated successfully')

  // Make logger available to middleware
  app.use((req, res, next) => {
    req.app.set('logger', logger)
    next()
  })

  // Apply global exception filter for centralized error handling
  app.useGlobalFilters(new GlobalExceptionFilter(logger))

  // Enable CORS
  app.enableCors()

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  // Set up Swagger documentation with comprehensive metadata
  const config = new DocumentBuilder()
    .setTitle('OpenAgent.cloud Credential Store API')
    .setDescription(
      'A secure credential store for AI components with comprehensive token usage tracking and analytics. ' +
        'This API allows you to manage credentials, proxy requests to AI services, and retrieve detailed analytics on token usage.'
    )
    .setVersion('1.0')
    .setContact('OpenAgent.cloud', 'https://openagent.cloud', 'support@openagent.cloud')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:5860', 'Local development server')
    .addServer('https://proxy.openagent.cloud', 'Production server')
    .addTag('Auth', 'Manage authentication and authorization for the API')
    .addTag('User Settings', 'Manage user settings')
    .addTag('Tenants', 'Manage multi-tenant access and configuration for the API')
    .addTag('Credentials', 'Manage service credentials for various AI providers')
    .addTag('Content', 'Manage content for the API')
    .addTag('Flows', 'Manage xyflow chart canvas')
    .addTag('Proxy', 'Proxy requests to AI services with automatic token tracking')
    .addTag('Agents', 'Manage OpenAI agents for AI interactions')
    .addTag('Analytics', 'Retrieve detailed token usage analytics and reporting')
    .addTag('Contact', 'Manage contact information for the API')
    .addTag(
      'Mailing List',
      'Manage mailing list subscriptions for marketing and notification purposes'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API key for tenant authentication'
      },
      'x-api-key'
    )
    .build()

  // Create Swagger document with full schema validation
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    extraModels: []
  })

  // Set up Swagger UI with enhanced options
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    jsonDocumentUrl: 'docs/swagger.json',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true
    }
  })

  // catches SIGTERM sent by ts-node-dev
  app.enableShutdownHooks()
  process.on('SIGTERM', async () => {
    // optional double-safety
    await app.close()
  })

  // Start the server
  await app.listen(port, '0.0.0.0')

  logger.log(`Application is running on: http://localhost:${port}`)
  logger.log(`Swagger documentation available at: http://localhost:${port}/docs`)

  // Log application startup with detailed environment info
  logger.log('Application startup complete', 'Bootstrap', {
    nodeEnv: configService.nodeEnv,
    port: configService.port,
    version: process.env.npm_package_version || '0.0.0',
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage()
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()
