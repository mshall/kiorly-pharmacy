import { PrismaClient } from "../generated/prisma/client";
import { type RemovalReport } from "../common/demo-data";
export declare function run(argv: string[], prisma: PrismaClient, log?: (m: string) => void): Promise<RemovalReport | null>;
