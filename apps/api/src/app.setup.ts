import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./common/db-error.filter";

/** Machine API outside the /api/v1 prefix (same convention as Kiorly's marketplace API). */
export const PREFIX_EXCLUDES = ["marketplace/v1/(.*)"];

/** Shared by main.ts and e2e tests so they boot identically. Create the app with `{ rawBody: true }` (webhook/HMAC verification needs raw bytes). */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix("api/v1", { exclude: PREFIX_EXCLUDES });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  if (process.env.SWAGGER_ENABLED !== "false") {
    const doc = buildOpenApi(app);
    SwaggerModule.setup("docs", app, doc, { jsonDocumentUrl: "docs-json" });
  }
}

export function buildOpenApi(app: INestApplication) {
  return SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle("Kiorly Pharmacy API").setDescription("Kiorly Pharmacy (KX-06): catalogue, inventory/lots/FEFO, Rx + dispensing with pharmacist sign-off, POS, suppliers, Kiorex orders.").setVersion("1.0.0").addBearerAuth().build(),
  );
}
