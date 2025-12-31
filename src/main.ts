import ConfigurationService from '@/core/services/configuration.service';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      whitelist: true,
    }),
  );
  const config = app.get(ConfigurationService);
  if (config.get('NODE_ENV') === 'dev') {
    const options = new DocumentBuilder()
      .setTitle('Base APi')
      .setDescription('Base Api')
      .setVersion('1.0')
      .addServer('http://localhost:3000/', 'DEV')
      .addTag('Base Api')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
