import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SubscriptionRepo extends KyselyRepo {
  protected readonly tableName = "subscriptions";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  // Subscriptions use external IDs and are typically immutable (create-only)
  public override async save(model: any) {
    // Always create - subscriptions are immutable
    await this.db.insertInto("subscriptions").values({
      id: model.id, churchId: model.churchId, personId: model.personId, customerId: model.customerId
    }).execute();
    return model;
  }

  public async loadByCustomerId(churchId: string, customerId: string) {
    return await this.db.selectFrom("subscriptions").selectAll()
      .where("customerId", "=", customerId).where("churchId", "=", churchId)
      .executeTakeFirst() ?? null;
  }

  public convertToModel(_churchId: string, data: any) {
    return { id: data.id, churchId: data.churchId, personId: data.personId, customerId: data.customerId };
  }
}
