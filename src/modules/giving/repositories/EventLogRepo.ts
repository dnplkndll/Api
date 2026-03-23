import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class EventLogRepo extends KyselyRepo {
  protected readonly tableName = "eventLogs";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  public override async save(model: any) {
    if (model.providerId) {
      const existingEvent = await this.loadByProviderId(model.churchId, model.providerId);
      if (existingEvent) {
        const updated = { ...model, id: (existingEvent as any).id };
        const { id: _id, churchId: _cid, ...setData } = updated;
        await this.db.updateTable("eventLogs").set(setData)
          .where("id", "=", updated.id).where("churchId", "=", updated.churchId).execute();
        return updated;
      }
    }
    // Create
    if (!model.id) model.id = UniqueIdHelper.shortId();
    await this.db.insertInto("eventLogs").values({
      id: model.id, churchId: model.churchId, customerId: model.customerId,
      provider: model.provider, providerId: model.providerId, eventType: model.eventType,
      message: model.message, status: model.status, created: model.created, resolved: false
    }).execute();
    return model;
  }

  public async loadByProviderId(churchId: string, providerId: string) {
    return await this.db.selectFrom("eventLogs").selectAll()
      .where("churchId", "=", churchId).where("providerId", "=", providerId)
      .limit(1).executeTakeFirst() ?? null;
  }

  public async loadByType(churchId: string, status: string) {
    const result = await sql`
      SELECT eventLogs.*, personId FROM customers
      LEFT JOIN eventLogs ON customers.id = eventLogs.customerId
      WHERE eventLogs.status=${status} AND eventLogs.churchId=${churchId}
      ORDER BY eventLogs.created DESC
    `.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any) {
    return { ...data };
  }
}
