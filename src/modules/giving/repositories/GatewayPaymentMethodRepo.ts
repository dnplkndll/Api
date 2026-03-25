import { injectable } from "inversify";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class GatewayPaymentMethodRepo extends KyselyRepo {
  protected readonly tableName = "gatewayPaymentMethods";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  public override async save(model: any) {
    if (model.id) {
      const metadata = model.metadata ? JSON.stringify(model.metadata) : null;
      await this.db.updateTable("gatewayPaymentMethods").set({
        gatewayId: model.gatewayId, customerId: model.customerId, externalId: model.externalId,
        methodType: model.methodType, displayName: model.displayName, metadata
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      const metadata = model.metadata ? JSON.stringify(model.metadata) : null;
      await this.db.insertInto("gatewayPaymentMethods").values({
        id: model.id, churchId: model.churchId, gatewayId: model.gatewayId, customerId: model.customerId,
        externalId: model.externalId, methodType: model.methodType, displayName: model.displayName, metadata
      }).execute();
    }
    return model;
  }

  public convertToModel(_churchId: string, data: any) {
    if (!data) return null;
    return {
      id: data.id,
      churchId: data.churchId,
      gatewayId: data.gatewayId,
      customerId: data.customerId,
      externalId: data.externalId,
      methodType: data.methodType,
      displayName: data.displayName,
      metadata: this.parseJson(data.metadata),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }

  public async loadByExternalId(churchId: string, gatewayId: string, externalId: string) {
    const row = await this.db.selectFrom("gatewayPaymentMethods").selectAll()
      .where("churchId", "=", churchId).where("gatewayId", "=", gatewayId).where("externalId", "=", externalId)
      .limit(1).executeTakeFirst() ?? null;
    return row ? this.convertToModel(churchId, row) : null;
  }

  public async deleteByExternalId(churchId: string, gatewayId: string, externalId: string): Promise<void> {
    await this.db.deleteFrom("gatewayPaymentMethods")
      .where("churchId", "=", churchId).where("gatewayId", "=", gatewayId).where("externalId", "=", externalId).execute();
  }

  public async loadByCustomer(churchId: string, gatewayId: string, customerId: string) {
    return this.db.selectFrom("gatewayPaymentMethods").selectAll()
      .where("churchId", "=", churchId).where("gatewayId", "=", gatewayId).where("customerId", "=", customerId)
      .execute();
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
