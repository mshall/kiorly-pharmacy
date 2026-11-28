import { type Edition } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
export declare class PlanPricesService {
    private readonly prisma;
    private readonly log;
    constructor(prisma: PrismaService);
    overview(): Promise<{
        editions: ("LITE" | "PRO" | "CHAIN")[];
        prices: {
            id: string;
            edition: string;
            marketCode: string;
            interval: string;
            currency: string;
            amount: string;
            validFrom: string;
            validTo: string | null;
            priceVersion: number;
            proposalId: string | null;
            proposedBy: string | null;
            publishedBy: string | null;
            createdAt: string;
        }[];
        organisations: {
            edition: Edition;
            marketCode: string;
            count: number;
        }[];
    }>;
    request(body: unknown, now?: Date): Promise<{
        preview: true;
        priceVersion: number;
        supersedes: boolean;
        validFrom: string;
        impact: {
            organisationsAffected: number;
            from: {
                amount: string;
                currency: string;
                priceVersion: number;
            } | null;
            to: {
                amount: string;
                currency: string;
            };
        };
        published?: undefined;
        idempotent?: undefined;
        price?: undefined;
    } | {
        published: true;
        idempotent: boolean;
        price: {
            id: string;
            edition: string;
            marketCode: string;
            interval: string;
            currency: string;
            amount: string;
            validFrom: string;
            validTo: string | null;
            priceVersion: number;
            proposalId: string | null;
            proposedBy: string | null;
            publishedBy: string | null;
            createdAt: string;
        };
        preview?: undefined;
        priceVersion?: undefined;
        supersedes?: undefined;
        validFrom?: undefined;
        impact?: undefined;
    }>;
}
