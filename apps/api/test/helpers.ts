import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { randomUUID } from "node:crypto";
import type { PrismaClient, StaffRole, Edition } from "@prisma/client";
import { loadEnv } from "../src/config/env";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/app.setup";
import { PrismaService } from "../src/prisma/prisma.service";
import { FeatureFlagsService } from "../src/feature-flags/feature-flags.service";
import { OutboxDeliveryService } from "../src/outbox/outbox-delivery.service";
import { hashPassword } from "../src/auth/password";
import { seal } from "../src/common/secret-box";
import { marketToday } from "../src/common/dates";

export const PASSWORD = "Passw0rd!x";
const day = 86_400_000;
export const isoDate = (offsetDays: number) => new Date(marketToday().getTime() + offsetDays * day).toISOString().slice(0, 10);

export interface TestApp {
  app: INestApplication;
  http: ReturnType<typeof request>;
  prisma: PrismaService;
  flags: FeatureFlagsService;
  outbox: OutboxDeliveryService;
  close: () => Promise<void>;
}

export async function bootApp(): Promise<TestApp> {
  loadEnv();
  process.env.NODE_ENV = "test";
  process.env.SWAGGER_ENABLED = "false";
  process.env.JOBS_ENABLED = "false";
  const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = mod.createNestApplication({ rawBody: true });
  configureApp(app);
  await app.init();
  return {
    app, http: request(app.getHttpServer()), prisma: app.get(PrismaService), flags: app.get(FeatureFlagsService), outbox: app.get(OutboxDeliveryService),
    close: async () => { await app.close(); },
  };
}

export interface Fixture {
  orgId: string; externalOrgId: string; branchId: string; branch2Id: string;
  /** Kiorex integration client of this tenant (key binds the tenant; webhookSecret signs Kiorex -> pharmacy events). */
  client: { key: string; secret: string; webhookSecret: string };
  users: Record<"owner" | "pharmacist" | "cashier" | "manager" | "chainOps", { id: string; email: string; token: string }>;
}

/** A fresh isolated tenant with 2 branches and one user per role. */
export async function seedTenant(t: TestApp, opts: { edition?: Edition; market?: string; settings?: object } = {}): Promise<Fixture> {
  const prisma = t.prisma as PrismaClient;
  const tag = randomUUID().slice(0, 8);
  const tenant = await prisma.tenant.create({ data: { name: `Test Pharmacy ${tag}`, edition: opts.edition ?? "PRO", marketCode: opts.market ?? "EG", externalOrgId: `org_${tag}`, settings: opts.settings ?? { ownerPhone: "+201000000000" }, onboardedAt: new Date() } });
  const b1 = await prisma.branch.create({ data: { orgId: tenant.id, name: "Main", code: `M${tag.slice(0, 3).toUpperCase()}`, licenceNo: "LIC-1" } });
  const b2 = await prisma.branch.create({ data: { orgId: tenant.id, name: "Second", code: `S${tag.slice(0, 3).toUpperCase()}` } });
  const passwordHash = await hashPassword(PASSWORD);
  const mk = async (role: StaffRole, key: string, extra: object = {}) => {
    const email = `${key}.${tag}@test.kiorly.local`;
    const u = await prisma.staffUser.create({ data: { orgId: tenant.id, displayName: `${key} ${tag}`, email, passwordHash, role, ...extra } });
    const res = await t.http.post("/api/v1/auth/login").send({ email, password: PASSWORD });
    if (res.status !== 200) throw new Error(`login failed ${res.status} ${JSON.stringify(res.body)}`);
    return { id: u.id, email, token: res.body.accessToken as string };
  };
  const users = {
    owner: await mk("OWNER", "owner", { pharmacistLicenceNo: `OWN-${tag}` }),
    pharmacist: await mk("PHARMACIST", "pharm", { pharmacistLicenceNo: `PH-${tag}`, branchId: b1.id }),
    cashier: await mk("CASHIER", "cash", { branchId: b1.id }),
    manager: await mk("BRANCH_MANAGER", "mgr", { branchId: b1.id }),
    chainOps: await mk("CHAIN_OPS", "chain"),
  };
  const client = { key: `kc_${tag}`, secret: `secret_${tag}_${randomUUID()}`, webhookSecret: `whsec_${tag}_${randomUUID()}` };
  await prisma.integrationClient.create({ data: { orgId: tenant.id, key: client.key, secretEnc: seal(client.secret), webhookSecretEnc: seal(client.webhookSecret) } });
  return { orgId: tenant.id, externalOrgId: tenant.externalOrgId!, branchId: b1.id, branch2Id: b2.id, client, users };
}

export const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

export interface DrugSeed { brandName?: string; activeIngredient?: string; strength?: string; dosageForm?: string; rxOnly?: boolean; controlledSchedule?: "NONE" | "SCHEDULE_1" | "SCHEDULE_2" | "SCHEDULE_3" | "SCHEDULE_4"; coldChain?: boolean; gtin?: string; price?: string }

/** Tenant-local drug + price via the real API. */
export async function seedDrug(t: TestApp, f: Fixture, d: DrugSeed = {}) {
  const tag = randomUUID().slice(0, 6);
  const res = await t.http.post("/api/v1/catalogue/drugs").set(auth(f.users.owner.token)).send({
    brandName: d.brandName ?? `Drug-${tag}`, activeIngredient: d.activeIngredient ?? `ingredient-${tag}`, strength: d.strength ?? "500 mg", dosageForm: d.dosageForm ?? "tablet", packSize: "20",
    rxOnly: d.rxOnly, controlledSchedule: d.controlledSchedule, coldChain: d.coldChain, gtin: d.gtin, price: d.price ?? "50.00",
  });
  if (res.status !== 201) throw new Error(`seedDrug ${res.status} ${JSON.stringify(res.body)}`);
  return res.body as { id: string; brandName: string };
}

export async function receive(t: TestApp, f: Fixture, args: { drugId: string; lotNumber?: string; expiryDays?: number; quantity?: number; unitCost?: string; branchId?: string; temperatureC?: number; supplierId?: string }) {
  const res = await t.http.post("/api/v1/inventory/receipts").set(auth(f.users.owner.token)).send({
    branchId: args.branchId ?? f.branchId, supplierId: args.supplierId, invoiceNo: `INV-${randomUUID().slice(0, 5)}`,
    lines: [{ drugId: args.drugId, lotNumber: args.lotNumber ?? `L-${randomUUID().slice(0, 5)}`, expiryDate: isoDate(args.expiryDays ?? 365), quantity: args.quantity ?? 100, unitCost: args.unitCost ?? "30.00", temperatureC: args.temperatureC }],
  });
  if (res.status !== 201) throw new Error(`receive ${res.status} ${JSON.stringify(res.body)}`);
  const lot = await (t.prisma as PrismaClient).stockLot.findFirstOrThrow({ where: { id: res.body.lines[0].lotId } });
  return lot;
}

export async function openShift(t: TestApp, f: Fixture, float = "100.00", token = f.users.cashier.token) {
  const res = await t.http.post("/api/v1/pos/shifts/open").set(auth(token)).send({ openingFloat: float });
  if (res.status !== 201) throw new Error(`openShift ${res.status} ${JSON.stringify(res.body)}`);
  return res.body as { id: string };
}

export const key = () => `k-${randomUUID()}`;

/** Sums the ledger (all stock-affecting movements) for a lot. */
export async function ledgerOnHand(prisma: PrismaClient, lotId: string): Promise<number> {
  const r = await prisma.stockMovement.aggregate({ where: { lotId, type: { notIn: ["RESERVE", "RELEASE_RESERVATION"] } }, _sum: { qtyDelta: true } });
  return r._sum.qtyDelta ?? 0;
}
