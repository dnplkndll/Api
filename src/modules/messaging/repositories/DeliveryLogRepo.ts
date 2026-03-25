import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class DeliveryLogRepo extends KyselyRepo {
  protected readonly tableName = "deliveryLogs";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable("deliveryLogs").set({
        success: model.success,
        errorMessage: model.errorMessage
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO "deliveryLogs" (id, "churchId", "personId", "contentType", "contentId", "deliveryMethod", success, "errorMessage", "deliveryAddress", "attemptTime") VALUES (${model.id}, ${model.churchId}, ${model.personId}, ${model.contentType}, ${model.contentId}, ${model.deliveryMethod}, ${model.success}, ${model.errorMessage}, ${model.deliveryAddress}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("deliveryLogs").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByContent(contentType: string, contentId: string) {
    return this.db.selectFrom("deliveryLogs").selectAll()
      .where("contentType", "=", contentType)
      .where("contentId", "=", contentId)
      .orderBy("attemptTime", "desc")
      .execute();
  }

  public async loadByPerson(churchId: string, personId: string, startDate?: Date, endDate?: Date) {
    let q = this.db.selectFrom("deliveryLogs").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId);
    if (startDate) q = q.where("attemptTime", ">=", startDate);
    if (endDate) q = q.where("attemptTime", "<=", endDate);
    return q.orderBy("attemptTime", "desc").execute();
  }

  public async loadRecent(churchId: string, limit: number = 100) {
    return this.db.selectFrom("deliveryLogs").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("attemptTime", "desc")
      .limit(limit)
      .execute();
  }
}
