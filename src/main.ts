import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { terminate } from './utils/error';
import * as morgan from 'morgan';
import { logger } from './utils/logger';
import { responseHandler } from './utils';
import { ValidationError } from 'class-validator';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('combined', {
    stream: {
      write: (message: any) => {
        logger.http(message);
      }
    }
  }));

  app.use(helmet());

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://dashboard.render.com'];
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Enables cookies
  };

  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('Novaship API Doc')
    .setDescription('API Doc')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in the following format: JWT without Bearer`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'Authorization'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    forbidUnknownValues: false,
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const result = validationErrors.map((error) => ({
        message: error.constraints[Object.keys(error.constraints)[0]]
      }));
      return responseHandler({
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: result[0].message,
        data: {}
      });
    },
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    logger.info(`Service is running on port ${port}`);
  });

  const errorHandler = terminate(app);
  process.on('uncaughtException', errorHandler(1, 'Unexpected Error'));
  process.on('unhandledRejection', errorHandler(1, 'Unhandled Promise'));
  process.on('SIGTERM', errorHandler(0, 'SIGTERM'));
  process.on('SIGINT', errorHandler(0, 'SIGINT'));
  process.on('exit', errorHandler(0, 'exit'));
}

bootstrap();