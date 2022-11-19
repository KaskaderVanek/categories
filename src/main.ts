import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function start() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Categories Swagger')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .addServer(process.env.URL_SERVER)
    .build()
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  })

  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => console.log(`Server started on PORT - ${PORT}`))
}

start()
