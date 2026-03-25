import { injectable } from "inversify";
import { DateHelper, UniqueIdHelper } from "@churchapps/apihelper";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { getDialect } from "../../../db/index.js";

@injectable()
export class StreamingServiceRepo extends KyselyRepo {
  protected readonly tableName = "streamingServices";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.serviceTime) model.serviceTime = DateHelper.toMysqlDate(model.serviceTime);

    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable("streamingServices").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("streamingServices").values(model).execute();
    }
    return model;
  }

  public async delete(id: string, churchId: string): Promise<any> {
    await this.db.deleteFrom("streamingServices")
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadAll(churchId: string): Promise<any[]> {
    return this.db.selectFrom("streamingServices").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("serviceTime")
      .execute();
  }

  public async loadById(id: string, churchId: string) {
    return (await this.db.selectFrom("streamingServices").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadAllRecurring() {
    return this.db.selectFrom("streamingServices").selectAll()
      .where("recurring", "=", true as any)
      .orderBy("serviceTime")
      .execute();
  }

  public async advanceRecurringServices() {
    if (getDialect() === "postgres") {
      await sql`UPDATE "streamingServices" SET "serviceTime" = "serviceTime" + (CEIL(EXTRACT(EPOCH FROM (NOW() + INTERVAL '6 hours' - "serviceTime")) / 86400 / 7) * 7) * INTERVAL '1 day' WHERE recurring = true AND "serviceTime" < NOW() - INTERVAL '6 hours'`.execute(this.db);
    } else {
      await sql`UPDATE "streamingServices" SET "serviceTime" = DATE_ADD("serviceTime", INTERVAL CEIL(TIMESTAMPDIFF(DAY, "serviceTime", DATE_ADD(NOW(), INTERVAL 6 HOUR)) / 7) * 7 DAY) WHERE recurring = true AND "serviceTime" < DATE_SUB(NOW(), INTERVAL 6 HOUR)`.execute(this.db);
    }
  }
}
