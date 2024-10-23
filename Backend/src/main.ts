import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv'; // Asegúrate de usar el asterisco aquí

async function bootstrap() {
  dotenv.config(); // Cargar las variables de entorno
  const app = await NestFactory.create(AppModule);
  app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']); // Habilita todos los niveles de log
  // Habilita CORS especificando solo el origen del frontend y evitando redirecciones
  app.enableCors({
    origin: 'https://tallerheber.losdela.com',  // Especifica el dominio del frontend
    methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Si usas cookies o autenticación, mantenlo en true
  });

  const port = process.env.PORT || 3000;
  app.use(cookieParser());
  await app.listen(port);

  const serverUrl = await app.getUrl();
  console.log(`Servidor ejecutándose en ${serverUrl}`);
}

bootstrap();
