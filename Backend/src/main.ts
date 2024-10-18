import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir solicitudes desde ambos orígenes
  app.enableCors({
    origin: [
      'https://tallerheber.losdela.com',  // Origen HTTPS
      'https://tallerheber.losdela.com/login',  // Origen HTTPS
      'http://tallerheber.losdela.com',   // Origen HTTP
      'http://localhost:4200',          // Origen local para desarrollo
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',  // Métodos permitidos
    credentials: true,  // Si necesitas habilitar el envío de cookies o credenciales
  });

  const port = 3000;
  await app.listen(port);
  const serverUrl = await app.getUrl();
  console.log(`Servidor ejecutándose en ${serverUrl}`);
}

bootstrap();
