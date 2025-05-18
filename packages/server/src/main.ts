import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for client applications
  app.enableCors();

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Electric Blog API')
    .setDescription('The Electric Blog API with local-first sync')
    .setVersion('1.0')
    .addTag('blogs')
    .addTag('comments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.SERVER_PORT || 3000;
  console.log(`Server starting on port ${port}`);
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log(`Swagger UI available at http://0.0.0.0:${port}/api`);
}
void bootstrap();
