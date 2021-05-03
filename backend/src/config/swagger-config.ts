import { HttpException, INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const configSwagger = (app: INestApplication): void => {
    const config = new DocumentBuilder()
        .setTitle('Kudo-Box-v2')
        .setDescription('Kudo-Box API documentation')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}

export default configSwagger;