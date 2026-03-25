import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { getDialect } from "../../../db/index.js";
import { injectable } from "inversify";

@injectable()
export class PageHistoryRepo extends KyselyRepo {
  protected readonly tableName = "pageHistory";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadAll(churchId: string) {
    return this.db.selectFrom("pageHistory").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("createdDate", "desc")
      .execute();
  }

  public async loadForPage(churchId: string, pageId: string, limit: number = 50) {
    return this.db.selectFrom("pageHistory").selectAll()
      .where("churchId", "=", churchId)
      .where("pageId", "=", pageId)
      .orderBy("createdDate", "desc")
      .limit(limit)
      .execute();
  }

  public async loadForBlock(churchId: string, blockId: string, limit: number = 50) {
    return this.db.selectFrom("pageHistory").selectAll()
      .where("churchId", "=", churchId)
      .where("blockId", "=", blockId)
      .orderBy("createdDate", "desc")
      .limit(limit)
      .execute();
  }

  public async deleteOldHistory(churchId: string, pageId: string, daysToKeep: number = 30) {
    const cutoff = getDialect() === "postgres"
      ? sql`NOW() - ${sql.lit(daysToKeep)} * INTERVAL '1 day'`
      : sql`DATE_SUB(NOW(), INTERVAL ${daysToKeep} DAY)`;
    await sql`DELETE FROM "pageHistory" WHERE "churchId"=${churchId} AND "pageId"=${pageId} AND "createdDate" < ${cutoff}`.execute(this.db);
  }
}
