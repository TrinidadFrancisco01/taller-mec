import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir solicitudes desde http://localhost:4200
  app.enableCors({
    origin: 'http://tallerheber.losdela.com',  // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos permitidos
    credentials: true,  // Si necesitas habilitar el envío de cookies o credenciales
  });
  // Establece un puerto estático. En local será 3000, pero en Vercel se asignará dinámicamente.
  const port = 3000;
  await app.listen(port);

  // Imprime la URL del servidor dinámicamente según dónde esté corriendo
  const serverUrl = await app.getUrl();
  console.log(`Servidor ejecutándose en ${serverUrl}`);
}
bootstrap();