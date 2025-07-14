import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { promises as fs } from 'fs';
import { Request, Response, NextFunction } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Headers CORS globais
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    );
    next();
  });

  // Prefixo da API
  app.setGlobalPrefix('api');

  // Configuração do Swagger
  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('RepoTEC API')
    .setDescription('API do Repositório de Projetos Técnicos')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/api-docs', app, document);

  void fs.writeFile('./swagger-spec.json', JSON.stringify(document));

  // Servir arquivos estáticos do frontend
  app.useStaticAssets(join(__dirname, '..', 'dist-frontend'), {
    index: false,
  });

  // Rota de fallback para o index.html
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, '..', 'dist-frontend', 'index.html'));
    } else {
      next();
    }
  });


  // Validação Global com mensagens em português
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => {
          const property = error.property;
          const messages = Object.values(error.constraints || {});

          // Traduzir mensagens específicas
          const translatedMessages = messages.map((message) => {
            if (message.includes('senha must be longer')) {
              return 'Senha curta demais: ' + message;
            }
            if (message.includes('email must be an email')) {
              return 'O email deve ser válido';
            }
            if (message.includes('email must be a valid email')) {
              return 'O email deve ser válido';
            }
            if (message.includes('should not be empty')) {
              return 'Este campo não pode estar vazio';
            }
            if (
              message.includes(
                'A senha deve conter pelo menos uma letra e um caractere especial',
              )
            ) {
              return 'A senha deve conter pelo menos uma letra e um caractere especial';
            }
            return message;
          });

          return {
            property,
            messages: translatedMessages,
          };
        });

        return {
          statusCode: 400,
          error: 'Requisição Inválida',
          message: result.map((r) => r.messages).flat(),
        };
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
