import { INestApplication } from "@nestjs/common";
import "./common/decimal-json";
export declare const PREFIX_EXCLUDES: string[];
export declare function configureApp(app: INestApplication): void;
export declare function buildOpenApi(app: INestApplication): import("@nestjs/swagger").OpenAPIObject;
