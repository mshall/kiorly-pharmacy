import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/** Shared by main.ts and e2e tests so they boot identically. */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  if (process.env.SWAGGER_ENABLED !== "false") {
    const doc = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle("Kiorly Pharmacy API").setDescription("Skeleton: health only (draft).").setVersion("0.0.1").build(),
    );
    SwaggerModule.setup("docs", app, doc);
  }
}
