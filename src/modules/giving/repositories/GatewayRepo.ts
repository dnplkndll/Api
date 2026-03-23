import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { Gateway } from "../models/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class GatewayRepo extends KyselyRepo {
  protected readonly tableName = "gateways";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  public override async save(model: any) {
    if (model.id) {
      return this.updateGateway(model);
    } else {
      return this.createGateway(model);
    }
  }

  private async createGateway(gateway: any) {
    gateway.id = UniqueIdHelper.shortId();
    // enforce a single record per church (for now)
    await this.db.deleteFrom("gateways")
      .where("churchId", "=", gateway.churchId).where("id", "<>", gateway.id).execute();
    const settings = gateway.settings ? JSON.stringify(gateway.settings) : null;
    await this.db.insertInto("gateways").values({
      id: gateway.id, churchId: gateway.churchId, provider: gateway.provider,
      publicKey: gateway.publicKey, privateKey: gateway.privateKey, webhookKey: gateway.webhookKey,
      productId: gateway.productId, payFees: gateway.payFees, currency: gateway.currency,
      settings, environment: gateway.environment
    }).execute();
    return gateway;
  }

  private async updateGateway(gateway: any) {
    const settings = gateway.settings ? JSON.stringify(gateway.settings) : null;
    await this.db.updateTable("gateways").set({
      provider: gateway.provider, publicKey: gateway.publicKey, privateKey: gateway.privateKey,
      webhookKey: gateway.webhookKey, productId: gateway.productId, payFees: gateway.payFees,
      currency: gateway.currency, settings, environment: gateway.environment
    }).where("id", "=", gateway.id).where("churchId", "=", gateway.churchId).execute();
    return gateway;
  }

  private rowToModel(data: any): Gateway {
    return {
      id: data.id,
      churchId: data.churchId,
      provider: data.provider,
      publicKey: data.publicKey,
      privateKey: data.privateKey,
      webhookKey: data.webhookKey,
      productId: data.productId,
      payFees: data.payFees,
      currency: data.currency,
      settings: this.parseJson(data.settings),
      environment: data.environment,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }

  public convertToModel(_churchId: string, data: any) {
    const model = this.rowToModel(data);
    // Strip sensitive fields - privateKey/webhookKey should never be returned to clients
    const { privateKey: _privateKey, webhookKey: _webhookKey, ...safeModel } = model;
    return safeModel;
  }

  public async loadByProvider(provider: string): Promise<Gateway[]> {
    const result = await sql`SELECT * FROM gateways WHERE LOWER(provider) = LOWER(${provider})`.execute(this.db);
    return (result.rows as any[]).map((r: any) => this.rowToModel(r));
  }

  private parseJson(value: unknown) {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value as Record<string, unknown>;
  }
}
