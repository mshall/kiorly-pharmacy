import type { Request, Response } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { ProviderLinksService } from "./provider-links.service";
export declare class PublicLinkController {
    private readonly links;
    private readonly prisma;
    private limiter?;
    constructor(links: ProviderLinksService, prisma: PrismaService);
    private throttle;
    resolve(rawCode: string, accept: string | undefined, req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
