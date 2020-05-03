import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AllExceptionsFilter } from "./all-exceptions-filter";
import { AppModule } from './app.module';
import * as crypto from "crypto";
import * as helmet from "helmet";
import * as rateLimit from 'express-rate-limit';
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as express from "express";
import * as fs from 'fs';
import * as compression from 'compression';

const logger = new Logger("Boostrap");
const PRODUCTION:boolean = JSON.parse(process.env.production);
if (!PRODUCTION) {
  dotenv.config();
}

const VARIABLES_REQUIRED = [
  "port",
  "production",
  "nbr_modulus_length",
  "hash_jwt_blacklist",
  "nbr_jwt_duration"
];
VARIABLES_REQUIRED.forEach(variable => {
  if (typeof process.env[variable] !== "string") {
    const msg = `Please be a good developer and give the environment variable [${variable}] as a string !!`;
    logger.error(msg);
    process.exit(1);
  }
});

const PORT:number = Number(process.env.port);
const modulusLength = Number(process.env.nbr_modulus_length);

if (!fs.existsSync("./config")) {
  fs.mkdirSync("./config");
  const keysOptions = {
    modulusLength,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  };
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", keysOptions);
  fs.writeFileSync("./config/publicKey.pem", publicKey);
  fs.writeFileSync("./config/privateKey.pem", privateKey);
}

async function bootstrap() {
  const logger = new Logger("Boostrap");
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn']
  });
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per
    })
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true,
    disableErrorMessages:false
  }));
  app.useLogger(logger);
  app.useGlobalFilters(new AllExceptionsFilter());

  if (!PRODUCTION) {
    const options = new DocumentBuilder()
    .setTitle('School documentation')
    .setVersion('1.0')
    .addTag('school')
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(PORT);
  console.log(`App is listenning on port ${PORT}`);
}
bootstrap()
  .catch(console.error);