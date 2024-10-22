import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS especificando solo el origen del frontend y evitando redirecciones
  app.enableCors({
    origin: 'https://tallerheber.losdela.com',  // Especifica el dominio del frontend
    methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Si usas cookies o autenticación, mantenlo en true
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const serverUrl = await app.getUrl();
  console.log(`Servidor ejecutándose en ${serverUrl}`);
}

bootstrap();
