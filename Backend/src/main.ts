import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv'; // Asegúrate de usar el asterisco aquí

async function bootstrap() {
  
  dotenv.config(); // Cargar las variables de entorno
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']); // Habilita todos los niveles de log

  // Habilita CORS para permitir cualquier origen
  app.enableCors({
    origin: ['https://tallerheber.losdela.com', 'http://localhost:4200'], // Permite solicitudes solo desde este origen
    methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si usas cookies o autenticación
  });
  

  const port = process.env.PORT || 3000;
  
  await app.listen(port);

  const serverUrl = await app.getUrl();
  console.log(`Servidor ejecutándose en ${serverUrl}`);
}

bootstrap();
