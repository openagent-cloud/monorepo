import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { validateEnv } from './config/env.schema'
import { ConfigService } from './config/config.service'
import { LoggerService, GlobalExceptionFilter, LoggingInterceptor, setupLogsDirectory } from './logger'

async function bootstrap() {
  // Set up logs directory first to ensure it exists
  setupLogsDirectory();
  
  // Validate environment variables before app initialization
  // This will exit the process if any required variables are missing or invalid
  validateEnv();

  // Create the NestJS application with our custom logger
  const app = await NestFactory.create(AppModule);
  
  // Get our custom logger service and set the context
  // Use resolve() instead of get() for scoped providers
  const logger = await app.resolve(LoggerService);
  logger.setContext('Bootstrap');
  logger.log('Environment variables validated successfully');
  
  // Make logger available to middleware
  app.use((req, res, next) => {
    req.app.set('logger', logger);
    next();
  });
  
  // Apply global exception filter for centralized error handling
  app.useGlobalFilters(new GlobalExceptionFilter(logger))
  
  // Apply global interceptor for logging controller methods
  app.useGlobalInterceptors(new LoggingInterceptor(logger))

  // Enable CORS
  app.enableCors()

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
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
    .addTag('Credentials', 'Manage service credentials for various AI providers')
    .addTag('Proxy', 'Proxy requests to AI services with automatic token tracking')
    .addTag('Analytics', 'Retrieve detailed token usage analytics and reporting')
    .addApiKey({
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
      description: 'API key for tenant authentication'
    }, 'x-api-key')
    .build()

  // Create Swagger document with full schema validation
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    extraModels: [],
  })

  // Set up Swagger UI with enhanced options
  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
    }
  })

  // Use port 3000 to match Docker port mapping

  // Get port from ConfigService which has been validated by Zod
  const configService = app.get(ConfigService);
  const port = configService.port;

  // Start the server
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: http://0.0.0.0:${port}`);
  logger.log(`Swagger documentation available at: http://0.0.0.0:${port}/api`);
  
  // Log application startup with detailed environment info
  logger.log('Application startup complete', undefined, {
    nodeEnv: configService.nodeEnv,
    port: configService.port,
    version: process.env.npm_package_version || '0.0.0',
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
  });
}
bootstrap()
